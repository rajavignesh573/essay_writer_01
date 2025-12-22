import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { stripe, PRICING_PLANS } from '@/lib/stripe'
import { validatePlanType } from '@/lib/utils/validation'
import { formatErrorResponse, logError, AuthenticationError, ValidationError } from '@/lib/utils/errors'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new AuthenticationError()
    }

    // Parse and validate request body
    let body
    try {
      body = await request.json()
    } catch {
      throw new ValidationError('Invalid JSON in request body')
    }

    const { planType } = body

    if (!validatePlanType(planType)) {
      throw new ValidationError('Invalid plan type. Must be "monthly" or "annual"')
    }

    const plan = PRICING_PLANS[planType]

    // Get user email (with error handling)
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('id', user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      logError(profileError, { userId: user.id, action: 'get_profile_for_checkout' })
    }

    const customerEmail = profile?.email || user.email

    if (!customerEmail) {
      throw new ValidationError('User email is required for checkout')
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: customerEmail,
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

    if (!session.url) {
      throw new Error('Failed to create checkout session URL')
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    const errorResponse = formatErrorResponse(error)
    logError(error, { endpoint: '/api/create-checkout', method: 'POST' })
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode })
  }
}

