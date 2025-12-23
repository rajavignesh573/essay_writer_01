# Search Engine Verification Guide

This guide will help you verify your website with Google Search Console, Bing Webmaster Tools, and Yandex Webmaster.

## 🔍 Why Verify Your Website?

Verifying your website allows you to:
- Submit and monitor your sitemap
- View search performance data
- Get notified about indexing issues
- Access advanced SEO tools
- Monitor your site's visibility in search results

---

## 1️⃣ Google Search Console Verification

### Step 1: Create a Google Search Console Account

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Sign in with your Google account
3. Click **"Add Property"** or **"Add a property"**

### Step 2: Add Your Website

1. Choose **"URL prefix"** (recommended) or **"Domain"**
2. Enter your website URL: `https://your-domain.com`
3. Click **"Continue"**

### Step 3: Get Your Verification Code

Google will show you several verification methods. Choose **"HTML tag"**:

1. You'll see a meta tag like this:
   ```html
   <meta name="google-site-verification" content="abc123xyz456..." />
   ```
2. Copy the **content value** (the part after `content="` and before `"`)

### Step 4: Add to Your Environment Variables

**For Local Development (.env.local):**
```env
NEXT_PUBLIC_GOOGLE_VERIFICATION=abc123xyz456...
```

**For Production (Vercel/Other Hosting):**

1. **Vercel:**
   - Go to your project dashboard
   - Click **Settings** → **Environment Variables**
   - Add new variable:
     - Name: `NEXT_PUBLIC_GOOGLE_VERIFICATION`
     - Value: `abc123xyz456...` (your verification code)
     - Environment: Production, Preview, Development (select all)
   - Click **Save**
   - Redeploy your application

2. **Other Hosting Platforms:**
   - Find the environment variables section in your hosting dashboard
   - Add `NEXT_PUBLIC_GOOGLE_VERIFICATION` with your code
   - Restart/redeploy your application

### Step 5: Verify

1. Go back to Google Search Console
2. Click **"Verify"**
3. If successful, you'll see a success message!

### Step 6: Submit Your Sitemap

1. In Google Search Console, go to **Sitemaps** in the left menu
2. Enter: `sitemap.xml`
3. Click **"Submit"**
4. Wait a few minutes, then check if it's processed

---

## 2️⃣ Bing Webmaster Tools Verification

### Step 1: Create a Bing Webmaster Account

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Sign in with your Microsoft account (or create one)
3. Click **"Add a site"**

### Step 2: Add Your Website

1. Enter your website URL: `https://your-domain.com`
2. Click **"Add"**

### Step 3: Get Your Verification Code

1. Choose **"HTML meta tag"** verification method
2. You'll see a meta tag like this:
   ```html
   <meta name="msvalidate.01" content="xyz789abc123..." />
   ```
3. Copy the **content value**

### Step 4: Add to Environment Variables

**For Local Development (.env.local):**
```env
NEXT_PUBLIC_BING_VERIFICATION=xyz789abc123...
```

**For Production:**
- Add `NEXT_PUBLIC_BING_VERIFICATION` to your hosting platform's environment variables
- Value: Your verification code
- Redeploy

### Step 5: Verify and Submit Sitemap

1. Click **"Verify"** in Bing Webmaster Tools
2. Once verified, go to **Sitemaps**
3. Submit: `https://your-domain.com/sitemap.xml`

---

## 3️⃣ Yandex Webmaster Verification (Optional)

### Step 1: Create a Yandex Account

1. Go to [Yandex Webmaster](https://webmaster.yandex.com)
2. Sign in or create an account
3. Click **"Add site"**

### Step 2: Add Your Website

1. Enter your website URL
2. Click **"Add"**

### Step 3: Get Your Verification Code

1. Choose **"HTML tag"** method
2. You'll see a meta tag like:
   ```html
   <meta name="yandex-verification" content="def456ghi789..." />
   ```
3. Copy the **content value**

### Step 4: Add to Environment Variables

**For Local Development (.env.local):**
```env
NEXT_PUBLIC_YANDEX_VERIFICATION=def456ghi789...
```

**For Production:**
- Add `NEXT_PUBLIC_YANDEX_VERIFICATION` to your hosting platform
- Redeploy

### Step 5: Verify

1. Click **"Check"** in Yandex Webmaster
2. Once verified, submit your sitemap

---

## 📝 Complete Environment Variables Example

Create or update your `.env.local` file:

```env
# Site URL (Required)
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Search Engine Verification (Optional but Recommended)
NEXT_PUBLIC_GOOGLE_VERIFICATION=abc123xyz456...
NEXT_PUBLIC_BING_VERIFICATION=xyz789abc123...
NEXT_PUBLIC_YANDEX_VERIFICATION=def456ghi789...
```

---

## 🚀 Quick Setup Script

You can also use the sitemap submission helper:

```bash
node scripts/submit-sitemap.js
```

This script will:
- Show your sitemap URL
- Provide instructions for each search engine
- Optionally open the URLs in your browser

---

## ✅ Verification Checklist

- [ ] Google Search Console account created
- [ ] Google verification code added to environment variables
- [ ] Google Search Console verified
- [ ] Google sitemap submitted
- [ ] Bing Webmaster Tools account created
- [ ] Bing verification code added to environment variables
- [ ] Bing Webmaster Tools verified
- [ ] Bing sitemap submitted
- [ ] (Optional) Yandex Webmaster verified
- [ ] Environment variables set in production hosting

---

## 🔧 Troubleshooting

### Verification Failed?

1. **Check Environment Variables:**
   - Make sure the variable name is exactly `NEXT_PUBLIC_GOOGLE_VERIFICATION` (case-sensitive)
   - Ensure there are no extra spaces or quotes
   - Verify the code is correct (no typos)

2. **Redeploy:**
   - After adding environment variables, you must redeploy your application
   - The meta tag needs to be in the HTML for verification to work

3. **Check the Meta Tag:**
   - Visit your website
   - View page source (Ctrl+U or Cmd+U)
   - Search for `google-site-verification` (or `msvalidate.01` for Bing)
   - Verify the content value matches your code

4. **Wait a Bit:**
   - Sometimes verification takes a few minutes
   - Try again after 5-10 minutes

5. **Clear Cache:**
   - Clear your browser cache
   - Try incognito/private mode
   - Check if CDN is caching old HTML

### Where to Find Verification Codes Again?

- **Google:** Search Console → Settings → Ownership verification
- **Bing:** Webmaster Tools → Settings → Verification
- **Yandex:** Webmaster → Site settings → Verification

---

## 📊 After Verification

Once verified, you can:

1. **Monitor Performance:**
   - View search queries
   - See click-through rates
   - Monitor impressions

2. **Submit Sitemaps:**
   - Help search engines discover all your pages
   - Monitor indexing status

3. **Fix Issues:**
   - Get notified about crawl errors
   - Fix mobile usability issues
   - Improve page speed

4. **Request Indexing:**
   - Submit new pages for faster indexing
   - Re-index updated pages

---

## 🔗 Useful Links

- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [Yandex Webmaster](https://webmaster.yandex.com)
- [Google Search Central Documentation](https://developers.google.com/search/docs)
- [Bing Webmaster Help](https://www.bing.com/webmasters/help)

---

**Need Help?** Check the main [SEO_IMPLEMENTATION.md](./SEO_IMPLEMENTATION.md) file for more SEO tips.

