# Netlify Setup Guide - FB Listing App v4.0

This guide will walk you through deploying your app with the serverless backend function.

## What You're Deploying

**3 Files:**
1. `fb-listing-pwa-v4.0.html` - Your main app (rename to `fb-listing-pwa.html`)
2. `manifest.json` - PWA config
3. `sw.js` - Service worker

**Backend Function:**
1. `ebay-pricing.js` - Serverless function that calls eBay API
2. `netlify.toml` - Configuration file

---

## Step 1: Prepare Your Files on Your Computer

1. **Create a folder** on your Desktop called `fb-listing-netlify`

2. **Put these files in the main folder:**
   - `fb-listing-pwa.html` (renamed from fb-listing-pwa-v4.0.html)
   - `manifest.json`
   - `sw.js`
   - `netlify.toml`

3. **Create a subfolder structure:**
   ```
   fb-listing-netlify/
   ├── fb-listing-pwa.html
   ├── manifest.json
   ├── sw.js
   ├── netlify.toml
   └── netlify/
       └── functions/
           └── ebay-pricing.js
   ```

4. **Inside `fb-listing-netlify`**, create folder: `netlify`
5. **Inside `netlify`**, create folder: `functions`
6. **Put `ebay-pricing.js`** inside the `functions` folder

Your structure should look like this:
```
fb-listing-netlify/
├── fb-listing-pwa.html
├── manifest.json  
├── sw.js
├── netlify.toml
└── netlify/
    └── functions/
        └── ebay-pricing.js
```

---

## Step 2: Sign Up for Netlify (Free)

1. Go to: https://www.netlify.com/
2. Click **"Sign up"**
3. Sign up with GitHub (easiest - uses your existing GitHub account)
4. Authorize Netlify to access your GitHub

---

## Step 3: Deploy Your Site

### Option A: Drag & Drop (Easiest)

1. Once logged into Netlify, look for **"Add new site"** button
2. Click it, then select **"Deploy manually"**
3. **Drag your entire `fb-listing-netlify` folder** into the upload area
4. Netlify will upload and deploy everything
5. Wait 1-2 minutes for deployment to complete
6. You'll get a URL like: `https://random-name-123.netlify.app`

### Option B: Connect to GitHub (More Professional)

1. **Push your folder to GitHub first:**
   - Go to GitHub, create new repository called `fb-listing-netlify`
   - Upload all files maintaining the folder structure
   
2. **In Netlify:**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Select your `fb-listing-netlify` repository
   - Click "Deploy site"

---

## Step 4: Test Your Backend Function

Once deployed, your function will be available at:
```
https://your-site-name.netlify.app/.netlify/functions/ebay-pricing
```

Test it in your browser console (F12):
```javascript
fetch('https://your-site-name.netlify.app/.netlify/functions/ebay-pricing', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    searchQuery: 'iPhone 12',
    ebayAppId: 'YOUR_EBAY_APP_ID'
  })
})
.then(r => r.json())
.then(d => console.log(d));
```

You should see eBay results in the console.

---

## Step 5: Use Your App

1. **Your app URL:** `https://your-site-name.netlify.app/fb-listing-pwa.html`
2. **Open it on your iPhone in Safari**
3. **Add to Home Screen** (same as before)
4. **Open the app**
5. **Go to Settings** and enter your API keys
6. **Test with your Square Stand photos**

The eBay pricing should now work perfectly - no more CORS errors!

---

## Step 6: Custom Domain (Optional)

If you want a nicer URL:
1. In Netlify dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. You can use a free Netlify subdomain: `fb-listing.netlify.app`
4. Or connect your own domain if you have one

---

## Updating Your App Later

**When I give you a new version:**

### If using Drag & Drop:
1. Go to your site in Netlify dashboard
2. Click "Deploys" tab
3. Drag the updated files into "Drag and drop your site folder here"
4. Done - deploys in 1 minute

### If using GitHub:
1. Upload new files to your GitHub repository
2. Netlify auto-deploys in 1-2 minutes
3. Done

---

## Troubleshooting

### Function not working?
Check the Netlify dashboard:
1. Go to "Functions" tab
2. Click on `ebay-pricing`
3. View the logs to see any errors

### App can't find the function?
The function URL is relative: `/.netlify/functions/ebay-pricing`
This works automatically when deployed to Netlify.

### Still getting CORS errors?
Make sure you're accessing the app through the Netlify URL, not a local file.

---

## Why This Works

**Before:** Browser → eBay API ❌ (CORS blocked)

**Now:** Browser → Your Netlify Function → eBay API → Back to Browser ✅

The function runs on Netlify's servers, so there's no CORS restriction. Your browser only talks to your own Netlify site.

---

## Costs

**Netlify Free Tier Includes:**
- 100GB bandwidth/month
- 300 build minutes/month
- 125,000 serverless function requests/month

For personal use (even 100 listings/month), you'll never hit these limits. It's free forever for your use case.

---

## Next Steps

1. Deploy to Netlify using the steps above
2. Test the app with a product
3. Confirm eBay pricing data comes through
4. Install on your iPhone
5. Start creating listings!

If you get stuck at any step, let me know exactly where and I'll help troubleshoot.
