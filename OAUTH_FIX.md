# Fix Google OAuth Redirect URI Mismatch

## The Problem
Error 400: `redirect_uri_mismatch` means the redirect URI in Google Cloud Console doesn't match what Supabase is sending.

## The Solution

### Step 1: Add the Correct Redirect URI to Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Under **Authorized redirect URIs**, click **+ ADD URI**
6. Add this EXACT URI:
   ```
   https://zpayzsvmmuahfwoaotmc.supabase.co/auth/v1/callback
   ```
7. Click **SAVE**

### Step 2: Verify Supabase Configuration

1. Go to your Supabase project: https://supabase.com/dashboard/project/zpayzsvmmuahfwoaotmc
2. Go to **Authentication** → **Providers** → **Google**
3. Make sure:
   - Google provider is **Enabled**
   - **Client ID (for OAuth)** is your Google Client ID
   - **Client Secret (for OAuth)** is your Google Client Secret
4. Click **Save**

### Step 3: Test Again

1. Go back to your app: http://localhost:3000/login
2. Click "Sign in with Google"
3. It should work now!

## Important Notes

- The redirect URI must be **exactly** as shown above
- No trailing slashes
- Must use `https://` (not `http://`)
- Changes in Google Cloud Console may take a few minutes to propagate

## If Still Not Working

1. **Clear browser cache** and try again
2. **Wait 2-3 minutes** after saving in Google Cloud Console
3. **Double-check** the Client ID and Secret in Supabase match Google Cloud Console
4. Make sure you're using the **correct Google Cloud project**

## For Production

When you deploy to production, you'll need to add another redirect URI:
```
https://your-production-domain.com/auth/callback
```

But for now, the Supabase callback URL above is what you need for development.

