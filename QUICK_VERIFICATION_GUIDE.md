# Quick Verification Guide - 5 Minutes Setup

## 🚀 Fast Track: Google Search Console Verification

### Step 1: Get Your Code (2 minutes)

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click **"Add Property"** → Enter your website URL
3. Choose **"HTML tag"** verification method
4. Copy the code (the part inside `content="..."`)

Example:
```html
<meta name="google-site-verification" content="abc123xyz456" />
                                    ↑ Copy this part ↑
```

### Step 2: Add to Environment Variables (1 minute)

**For Local Development:**
Create or edit `.env.local`:
```env
NEXT_PUBLIC_GOOGLE_VERIFICATION=abc123xyz456
```

**For Production (Vercel):**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - Name: `NEXT_PUBLIC_GOOGLE_VERIFICATION`
   - Value: `abc123xyz456` (your code)
   - Environments: Select all (Production, Preview, Development)
3. Click **Save**
4. **Redeploy** your application

### Step 3: Verify (1 minute)

1. Go back to Google Search Console
2. Click **"Verify"**
3. ✅ Success!

### Step 4: Submit Sitemap (1 minute)

1. In Google Search Console, go to **Sitemaps**
2. Enter: `sitemap.xml`
3. Click **"Submit"**

---

## 📋 Complete Example

Your `.env.local` file should look like this:

```env
# Required
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
OPENAI_API_KEY=your_openai_key
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# SEO Verification (Optional)
NEXT_PUBLIC_GOOGLE_VERIFICATION=abc123xyz456
NEXT_PUBLIC_BING_VERIFICATION=xyz789abc123
NEXT_PUBLIC_YANDEX_VERIFICATION=def456ghi789
```

---

## ✅ Quick Checklist

- [ ] Got verification code from Google Search Console
- [ ] Added `NEXT_PUBLIC_GOOGLE_VERIFICATION` to `.env.local` (local) or Vercel (production)
- [ ] Redeployed application (if production)
- [ ] Clicked "Verify" in Google Search Console
- [ ] Submitted sitemap.xml

---

## 🆘 Troubleshooting

**Verification failed?**
1. Make sure you redeployed after adding the environment variable
2. Check the variable name is exactly `NEXT_PUBLIC_GOOGLE_VERIFICATION` (case-sensitive)
3. View your website's page source and search for `google-site-verification` to see if the meta tag is there
4. Wait 5-10 minutes and try again

**Where is the meta tag?**
- The meta tag is automatically added to your site's `<head>` via `app/layout.tsx`
- It uses the `verification` field in the metadata object
- No manual HTML editing needed!

---

For detailed instructions, see [SEARCH_ENGINE_VERIFICATION.md](./SEARCH_ENGINE_VERIFICATION.md)

