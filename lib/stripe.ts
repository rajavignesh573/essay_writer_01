import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export const PRICING_PLANS = {
  monthly: {
    price: 1900, // $19 in cents
    credits: 20,
    interval: 'month' as const,
  },
  annual: {
    price: 19000, // $190 in cents
    credits: 300,
    interval: 'year' as const,
  },
}

