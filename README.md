# HandyHub

A neighbourhood services marketplace connecting local clients with skilled workers — plumbers, cleaners, electricians and more. Built as a cross-platform mobile app (Android, iOS and web) with a live deployed version.

**Live demo:** https://handyhub-mobile.vercel.app

## Tech stack

- [Expo](https://expo.dev) (SDK 57) + [Expo Router](https://docs.expo.dev/router/introduction/) — file-based routing across native and web
- [React Native](https://reactnative.dev) + [NativeWind](https://www.nativewind.dev) (Tailwind CSS styling)
- [Supabase](https://supabase.com) — authentication, Postgres database with Row Level Security, realtime chat
- [Vercel](https://vercel.com) — web hosting and CI/CD

## Features

- Email/password sign-up and login via Supabase Auth, with persistent sessions
- Client and worker roles selected at sign-up
- Service categories and worker profiles
- **Real job requests** — clients submit service requests that are stored in Postgres
- Workers see open requests and can accept them (moves from *Requested* to *Ongoing*)
- Realtime one-on-one chat between users (Supabase realtime subscriptions)
- Notifications per user, marked read when viewed
- Profile management and settings

## Project structure

```
src/
  app/          # Expo Router screens (file-based routing)
  components/   # Reusable UI components
  lib/          # Supabase client, helpers, static demo data
  constants/    # Theme colours
supabase/
  schema.sql    # Database schema — tables + RLS policies
```

## Running locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:

   ```bash
   EXPO_PUBLIC_SUPABASE_URL=your-project-url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Create the database schema by running [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL Editor.

4. Start the app:

   ```bash
   npx expo start
   ```

   Scan the QR code with [Expo Go](https://expo.dev/go), or press `w` to open the web version.

## Deployment

The web version is deployed on Vercel. Build config lives in `vercel.json`; environment variables (`EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`) are set in the Vercel project settings. Deploying manually:

```bash
npx vercel --prod
```

## Known limitations

- The workers/ratings shown on the Home tab are seeded demo data; job requests, chats and notifications are fully backed by the database.
- Payment methods and saved addresses are placeholder screens.
- Photo upload on the request form is not implemented yet.
