import { NextRequest, NextResponse } from 'next/server'
import { stripe, PRICING_PLANS } from '@/lib/stripe'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { logError } from '@/lib/utils/errors'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    logError(new Error('Missing Stripe signature'), { endpoint: '/api/webhook/stripe' })
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    logError(new Error('STRIPE_WEBHOOK_SECRET not configured'), { endpoint: '/api/webhook/stripe' })
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    logError(err, { endpoint: '/api/webhook/stripe', action: 'signature_verification' })
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createServerSupabaseClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const planType = session.metadata?.planType
        const credits = parseInt(session.metadata?.credits || '0')

        if (userId && planType && credits > 0) {
          // Update user credits
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('credits')
            .eq('id', userId)
            .single()

          if (profile) {
            await supabase
              .from('user_profiles')
              .update({ credits: profile.credits + credits })
              .eq('id', userId)

            // Create subscription record if monthly
            if (planType === 'monthly') {
              const subscription = await stripe.subscriptions.retrieve(
                session.subscription as string
              )

              await supabase.from('subscriptions').insert({
                user_id: userId,
                stripe_subscription_id: subscription.id,
                stripe_customer_id: session.customer as string,
                plan_type: planType,
                status: subscription.status,
                current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                credits_allocated: credits,
              })
            }

            // Log activity
            await supabase.rpc('log_activity', {
              p_user_id: userId,
              p_action_type: 'payment',
              p_details: { planType, credits, amount: session.amount_total },
            })
          }
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription as string

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          const { data: subRecord } = await supabase
            .from('subscriptions')
            .select('user_id, plan_type')
            .eq('stripe_subscription_id', subscriptionId)
            .single()

          if (subRecord) {
            const plan = PRICING_PLANS[subRecord.plan_type as keyof typeof PRICING_PLANS]
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('credits')
              .eq('id', subRecord.user_id)
              .single()

            if (profile) {
              await supabase
                .from('user_profiles')
                .update({ credits: profile.credits + plan.credits })
                .eq('id', subRecord.user_id)

              await supabase
                .from('subscriptions')
                .update({
                  current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                  current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                  credits_allocated: plan.credits,
                })
                .eq('stripe_subscription_id', subscriptionId)
            }
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await supabase
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('stripe_subscription_id', subscription.id)

        const { data: subRecord } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single()

        if (subRecord) {
          await supabase.rpc('log_activity', {
            p_user_id: subRecord.user_id,
            p_action_type: 'subscription_canceled',
            p_details: { subscriptionId: subscription.id },
          })
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    logError(error, {
      endpoint: '/api/webhook/stripe',
      eventType: event.type,
      eventId: event.id,
    })
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

