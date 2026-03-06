# Setting Up Google OAuth

## Steps to configure Google Sign-In:

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 2. Create a New Project (or select existing)
- Click "Select a project" dropdown
- Click "New Project"
- Name it (e.g., "OnboardLink")

### 3. Enable APIs
- Go to "APIs & Services" → "Enabled APIs & Services"
- Click "+ Enable APIs and Services"
- Search for "Google+ API" and enable it

### 4. Create OAuth Credentials
- Go to "APIs & Services" → "Credentials"
- Click "Create Credentials" → "OAuth client ID"
- If prompted, configure the OAuth consent screen first:
  - User Type: External
  - App name: OnboardLink
  - User support email: your email
  - Developer contact: your email
  - Save and continue through the steps

### 5. Create OAuth Client ID
- Application type: Web application
- Name: OnboardLink Web Client
- Authorized JavaScript origins:
  - `http://localhost:3000`
- Authorized redirect URIs:
  - `http://localhost:3000/api/auth/callback/google`
- Click "Create"

### 6. Copy Credentials
Copy the Client ID and Client Secret to your `.env.local`:

```
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

### 7. Restart the Server
```bash
npm run dev
```

## For Production
Add your production domain to:
- Authorized JavaScript origins: `https://yourdomain.com`
- Authorized redirect URIs: `https://yourdomain.com/api/auth/callback/google`
