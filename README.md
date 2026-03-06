# OnboardLink

A simple client onboarding portal builder. Create step-by-step onboarding flows and share them with clients via a single link.

## Features

- 📋 Drag-and-drop step builder
- 🔗 Share onboarding via unique URL
- 📄 Support for URLs and PDF file uploads
- 🔐 Email/password and Google OAuth login
- 📊 Track client progress
- 🎯 Progressive step unlocking

## Tech Stack

- **Framework:** Next.js 15
- **Database:** SQLite (better-sqlite3)
- **Auth:** NextAuth.js
- **Styling:** Tailwind CSS

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.local.example` to `.env.local` and fill in:

```bash
AUTH_SECRET=your-random-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_URL=http://localhost:3000
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Google OAuth Setup

See [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) for detailed instructions.

## Deployment

This app requires a server environment (not static hosting like GitHub Pages).

**Recommended platforms:**
- [Vercel](https://vercel.com) — Best for Next.js
- [Railway](https://railway.app)
- [Render](https://render.com)

**Note:** For production, consider using PostgreSQL instead of SQLite for better concurrency.

## License

MIT
