# Essay Writer - Micro SaaS Application

A modern, subscription-based essay writing application built with Next.js, Supabase, and Stripe. Generate high-quality essays using AI, manage your writing history, and subscribe to flexible plans.

## Features

- 🤖 **AI-Powered Essay Generation** - Generate essays using GPT-4o-mini
- 🔐 **Google OAuth Authentication** - Secure login with Google
- 💳 **Stripe Integration** - Monthly and annual subscription plans
- 💰 **Credit System** - Track essay generation with credits
- 📝 **Essay History** - View, edit, and download all your essays
- 🔒 **Content Protection** - Prevent unauthorized copying
- 📊 **Activity Tracking** - Log all user actions

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database, Authentication)
- **Payments**: Stripe
- **AI**: OpenAI GPT-4o-mini
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key
- Stripe account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd blog2post
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `STRIPE_SECRET_KEY` - Your Stripe secret key
   - `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook secret
   - `NEXT_PUBLIC_SITE_URL` - Your site URL (e.g., http://localhost:3000)

4. **Set up Supabase Database**
   
   Run the SQL schema in your Supabase SQL editor:
   ```bash
   # Copy the contents of database/schema.sql and run it in Supabase SQL Editor
   ```

5. **Configure Supabase Authentication**
   - Go to Authentication > Providers in Supabase
   - Enable Google OAuth
   - Add your OAuth credentials
   - Set redirect URL to: `http://localhost:3000/auth/callback` (for development)

6. **Set up Stripe Webhook**
   - Go to Stripe Dashboard > Webhooks
   - Add endpoint: `https://your-domain.com/api/webhook/stripe`
   - Select events: `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted`
   - Copy the webhook secret to your `.env.local`

7. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
blog2post/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Auth callbacks
│   ├── dashboard/         # Main dashboard
│   ├── history/           # Essay history page
│   ├── login/             # Login page
│   └── pricing/           # Pricing page
├── components/            # React components
├── database/              # Database schema
├── lib/                   # Utility libraries
│   ├── supabase/         # Supabase clients
│   ├── openai.ts         # OpenAI integration
│   └── stripe.ts         # Stripe integration
└── middleware.ts          # Next.js middleware
```

## Database Schema

The application uses the following main tables:

- **user_profiles** - User information and credits
- **essays** - Generated essays
- **subscriptions** - User subscriptions
- **activity_logs** - User activity tracking

See `database/schema.sql` for the complete schema.

## Pricing Plans

- **Monthly Plan**: $19/month - 20 essay credits per month
- **Annual Plan**: $190/year - 300 essay credits total

New users receive 2 free credits upon signup.

## API Routes

- `POST /api/generate-essay` - Generate a new essay
- `PUT /api/update-essay` - Update an existing essay
- `POST /api/create-checkout` - Create Stripe checkout session
- `POST /api/webhook/stripe` - Handle Stripe webhooks

## Security Features

- Row Level Security (RLS) enabled on all tables
- Authentication required for all routes (except login)
- Content copying restricted (only via dedicated buttons)
- Secure payment processing with Stripe
- Activity logging for audit trails

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Deployment

1. Deploy to Vercel, Netlify, or your preferred platform
2. Update environment variables in your hosting platform
3. Update Supabase redirect URLs to your production domain
4. Update Stripe webhook URL to your production domain
5. Run the database schema in Supabase

## License

ISC

## Support

For issues and questions, please open an issue in the repository.

