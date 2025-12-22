import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { stripe, PRICING_PLANS } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planType } = await request.json()

    if (!planType || !['monthly', 'annual'].includes(planType)) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 })
    }

    const plan = PRICING_PLANS[planType as keyof typeof PRICING_PLANS]

    // Get user email
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('id', user.id)
      .single()

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: profile?.email || user.email,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${planType === 'monthly' ? 'Monthly' : 'Annual'} Essay Plan`,
              description: `${plan.credits} essay credits`,
            },
            unit_amount: plan.price,
            recurring: planType === 'monthly' ? { interval: 'month' } : undefined,
          },
          quantity: 1,
        },
      ],
      mode: planType === 'monthly' ? 'subscription' : 'payment',
      success_url: `${request.nextUrl.origin}/dashboard?success=true`,
      cancel_url: `${request.nextUrl.origin}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
        planType,
        credits: plan.credits.toString(),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

