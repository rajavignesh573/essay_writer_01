# Deploying to Vercel - Step-by-Step Guide

This guide will walk you through deploying your Next.js application to Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)
- All your service accounts set up (Supabase, Stripe, OpenAI)

## Step 1: Prepare Your Repository

1. **Ensure your code is committed and pushed to Git**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Verify your `.gitignore` includes environment files** (already done - `.env*.local` and `.env` are ignored)

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com) and sign in**

2. **Click "Add New Project"**

3. **Import your Git repository**
   - Select your Git provider (GitHub, GitLab, or Bitbucket)
   - Choose your repository (e.g., `essay_writer_01` or your actual repo name)
   - Click "Import"

4. **Configure your project**
   - **Framework Preset**: Next.js (should be auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

5. **Add Environment Variables** (IMPORTANT!)
   
   Click "Environment Variables" and add the following:
   
   | Variable Name | Value | Notes |
   |--------------|-------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Get from Supabase Dashboard > Settings > API |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Get from Supabase Dashboard > Settings > API |
   | `OPENAI_API_KEY` | Your OpenAI API key | Get from OpenAI Dashboard |
   | `STRIPE_SECRET_KEY` | Your Stripe secret key | Get from Stripe Dashboard > Developers > API keys (use the secret key, not publishable) |
   | `STRIPE_WEBHOOK_SECRET` | Your Stripe webhook secret | You'll get this after setting up the webhook (see Step 4) |
   | `NEXT_PUBLIC_SITE_URL` | Your Vercel deployment URL | Used for OAuth redirects. You can leave this empty initially, then set it to `https://your-project.vercel.app` after first deployment (see Step 3) |

6. **Click "Deploy"**

7. **Wait for deployment to complete** (usually 2-3 minutes)

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project or create new
   - Confirm settings
   - Add environment variables when prompted

4. **Deploy to production**
   ```bash
   vercel --prod
   ```

## Step 3: Update Environment Variables After First Deployment

After your first deployment, you'll get a URL like `https://your-project.vercel.app`.

**Why `NEXT_PUBLIC_SITE_URL` is needed:**
- This tells Supabase where to redirect users after OAuth login
- It's used in the login page to set the redirect URL
- Without it, OAuth redirects won't work properly

1. **Go to Vercel Dashboard > Your Project > Settings > Environment Variables**

2. **Add or Update `NEXT_PUBLIC_SITE_URL`** to your actual Vercel URL:
   ```
   https://your-project.vercel.app
   ```
   (Replace `your-project` with your actual project name from Vercel)

3. **Redeploy** (or it will auto-redeploy if you have auto-deploy enabled)

## Step 4: Configure Supabase for Production

1. **Go to Supabase Dashboard > Authentication > URL Configuration**

2. **Add your Vercel URL to Redirect URLs:**
   - Site URL: `https://your-project.vercel.app`
   - Redirect URLs: `https://your-project.vercel.app/auth/callback`

3. **Save changes**

## Step 5: Configure Stripe Webhook

1. **Go to Stripe Dashboard > Developers > Webhooks**

2. **Click "Add endpoint"**

3. **Enter your webhook URL:**
   ```
   https://your-project.vercel.app/api/webhook/stripe
   ```

4. **Select events to listen to:**
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.deleted`

5. **Click "Add endpoint"**

6. **Copy the "Signing secret"** (starts with `whsec_...`)

7. **Update in Vercel:**
   - Go to Vercel Dashboard > Your Project > Settings > Environment Variables
   - Update `STRIPE_WEBHOOK_SECRET` with the signing secret you just copied

8. **Redeploy** your application

## Step 6: Set Up Database (If Not Already Done)

1. **Go to Supabase Dashboard > SQL Editor**

2. **Run the schema** from `database/schema.sql`

3. **Verify tables are created:**
   - `user_profiles`
   - `essays`
   - `subscriptions`
   - `activity_logs`

## Step 7: Test Your Deployment

1. **Visit your Vercel URL**: `https://your-project.vercel.app`

2. **Test the following:**
   - ✅ Login with Google OAuth
   - ✅ Access dashboard
   - ✅ Generate an essay
   - ✅ View essay history
   - ✅ Test subscription flow (use Stripe test mode)
   - ✅ Verify webhook is receiving events (check Stripe Dashboard > Webhooks > Your endpoint)

## Step 8: Custom Domain (Optional)

1. **Go to Vercel Dashboard > Your Project > Settings > Domains**

2. **Add your custom domain**

3. **Follow DNS configuration instructions**

4. **Update environment variables:**
   - Update `NEXT_PUBLIC_SITE_URL` to your custom domain
   - Update Supabase redirect URLs
   - Update Stripe webhook URL

5. **Redeploy**

## Troubleshooting

### Build Fails

- Check build logs in Vercel Dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version (Vercel auto-detects, but you can set it in `package.json`)

### Environment Variables Not Working

- Ensure variables are added for **Production**, **Preview**, and **Development** environments
- Redeploy after adding/updating environment variables
- Check variable names match exactly (case-sensitive)

### OAuth Not Working

- Verify Supabase redirect URLs include your Vercel URL
- Check `NEXT_PUBLIC_SITE_URL` is set correctly
- Ensure Google OAuth is enabled in Supabase

### Webhook Not Receiving Events

- Verify webhook URL is correct in Stripe Dashboard
- Check `STRIPE_WEBHOOK_SECRET` is set correctly
- View webhook logs in Stripe Dashboard
- Check Vercel function logs for errors

### Database Connection Issues

- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Check Supabase project is active
- Verify RLS policies are set up correctly

## Continuous Deployment

Vercel automatically deploys when you push to your main branch. To configure:

1. **Go to Vercel Dashboard > Your Project > Settings > Git**

2. **Configure branch deployments:**
   - Production: `main` or `master`
   - Preview: All other branches

3. **Auto-deploy is enabled by default**

## Environment Variables Summary

Make sure these are all set in Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Production Guide](https://supabase.com/docs/guides/hosting/overview)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)

---

**Need Help?** Check Vercel's deployment logs or contact support through the Vercel Dashboard.

