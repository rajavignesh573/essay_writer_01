# Next Steps - Getting Your App Running

## ✅ Completed
- Project structure created
- Dependencies installed
- Supabase URL and anon key configured

## 🔄 Next Steps (In Order)

### Step 1: Set Up Database Schema in Supabase ⚠️ REQUIRED

1. Go to your Supabase project: https://supabase.com/dashboard/project/zpayzsvmmuahfwoaotmc
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open the file `database/schema.sql` from this project
5. Copy the ENTIRE contents of `database/schema.sql`
6. Paste it into the SQL Editor
7. Click **Run** (or press Ctrl+Enter)
8. You should see "Success. No rows returned" - this means it worked!

**What this does:**
- Creates all necessary tables (user_profiles, essays, subscriptions, activity_logs)
- Sets up automatic user profile creation with 2 free credits
- Configures Row Level Security (RLS) policies
- Creates activity logging function

---

### Step 2: Configure Google OAuth ⚠️ REQUIRED

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Google** and click to enable it
3. You'll need Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project (or use existing)
   - Enable Google+ API
   - Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
   - Set application type to **Web application**
   - Add authorized redirect URI: `https://zpayzsvmmuahfwoaotmc.supabase.co/auth/v1/callback`
   - Copy the **Client ID** and **Client Secret**
4. Paste them into Supabase Google provider settings
5. Save

**Alternative:** You can test without Google OAuth first, but users won't be able to sign in.

---

### Step 3: Add OpenAI API Key ⚠️ REQUIRED for Essay Generation

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click **Create new secret key**
4. Copy the key (you won't see it again!)
5. Update `.env.local`:
   ```bash
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

**Note:** You'll need to add billing to your OpenAI account to use the API.

---

### Step 4: Add Stripe Keys (Optional for now - needed for payments)

If you want to test payments:

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get your **Secret key** from Developers → API keys
3. For webhooks (development):
   - Install Stripe CLI: https://stripe.com/docs/stripe-cli
   - Run: `stripe listen --forward-to localhost:3000/api/webhook/stripe`
   - Copy the webhook signing secret
4. Update `.env.local`:
   ```bash
   STRIPE_SECRET_KEY=sk_test_your_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
   ```

**Note:** You can test the app without Stripe, but subscription features won't work.

---

### Step 5: Test the Application 🚀

1. Make sure all environment variables are set in `.env.local`
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open http://localhost:3000 in your browser
4. Try to sign in with Google OAuth
5. You should receive 2 free credits
6. Try generating an essay!

---

## Quick Test Checklist

- [ ] Database schema run successfully
- [ ] Google OAuth configured
- [ ] OpenAI API key added
- [ ] Can sign in with Google
- [ ] See 2 credits in dashboard
- [ ] Can generate an essay
- [ ] Essay appears in history

---

## Troubleshooting

**"Failed to generate essay"**
- Check OpenAI API key is correct
- Make sure you have credits in your OpenAI account

**"Unauthorized" or can't sign in**
- Verify Google OAuth is configured in Supabase
- Check redirect URL matches exactly

**Database errors**
- Make sure schema.sql was run completely
- Check Supabase logs for errors

**Can't see credits**
- Check database - user_profiles table should have your user with credits=2
- Refresh the page

---

## Priority Order

1. **Database Schema** (5 minutes) - Do this first!
2. **Google OAuth** (10-15 minutes) - Needed to test login
3. **OpenAI Key** (5 minutes) - Needed to generate essays
4. **Stripe** (15-20 minutes) - Only if testing payments

Start with Step 1 (Database Schema) - it's the quickest and most important!

