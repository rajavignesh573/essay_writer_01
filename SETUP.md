# Setup Guide

Follow these steps to set up your Essay Writer application:

## 1. Supabase Setup

### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and anon key from Settings > API

### Run Database Schema
1. Go to SQL Editor in Supabase
2. Copy and paste the contents of `database/schema.sql`
3. Run the SQL script

### Configure Google OAuth
1. Go to Authentication > Providers in Supabase
2. Enable Google provider
3. Add your Google OAuth credentials:
   - Client ID
   - Client Secret
4. Add redirect URL: `http://localhost:3000/auth/callback` (for development)
5. For production, add: `https://your-domain.com/auth/callback`

## 2. OpenAI Setup

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an API key
3. Add it to your `.env.local` file as `OPENAI_API_KEY`

## 3. Stripe Setup

### Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and create an account
2. Get your API keys from Developers > API keys
3. Add `STRIPE_SECRET_KEY` to your `.env.local`

### Set up Webhook
1. Go to Developers > Webhooks in Stripe
2. Click "Add endpoint"
3. For development, use Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook/stripe
   ```
   Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`
4. For production:
   - Add endpoint: `https://your-domain.com/api/webhook/stripe`
   - Select events:
     - `checkout.session.completed`
     - `invoice.payment_succeeded`
     - `customer.subscription.deleted`
   - Copy the webhook signing secret

## 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 5. Install and Run

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to see your application!

## 6. Testing

1. Sign up with Google OAuth
2. You should receive 2 free credits
3. Generate an essay to test the flow
4. Test the pricing page (use Stripe test cards)
5. Check your Supabase database to verify data is being stored

## Troubleshooting

### Authentication Issues
- Make sure redirect URLs are correctly configured in Supabase
- Check that Google OAuth credentials are correct

### Database Issues
- Verify the schema was run successfully
- Check RLS policies are enabled

### Payment Issues
- Use Stripe test mode for development
- Verify webhook endpoint is accessible
- Check webhook events are being received

### API Issues
- Verify all environment variables are set
- Check API keys are valid
- Review server logs for errors

