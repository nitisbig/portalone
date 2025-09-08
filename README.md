# PortalOne

This project provides a minimal Next.js setup featuring Material UI-based login and sign up pages backed by Supabase authentication.

## Getting Started

Install dependencies:

```
npm install
```

Run the development server:

```
npm run dev
```

Once signed in you can manage personal notes at `/notes`. Only authenticated users are able to create and view their notes, which are stored using Supabase.

## Environment Variables

Create a `.env.local` file in the project root with the following values:

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```
