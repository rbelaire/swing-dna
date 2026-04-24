# My Swing DNA

Golf performance webapp for coaches and students to track swing analysis data.

## Tech Stack

- **Frontend:** React 19 + Vite
- **Auth & Database:** Supabase (Postgres + Auth)
- **Styling:** Plain CSS with CSS custom properties (no CSS framework)

## Local Development

```bash
cp .env.example .env.local   # fill in Supabase credentials
npm install
npm run dev                  # http://localhost:5173
```

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Project URL from Supabase dashboard → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Anon/public key from the same page |

Never commit `.env.local`. The `.env.example` file shows required keys without values.

## Project Structure

```
src/
  main.jsx          # Entry point; wraps app in AuthProvider
  AuthContext.jsx   # Supabase auth context (signIn, signUp, signOut, user state)
  supabaseClient.js # Supabase client singleton
  App.jsx           # Root component: sign-in form + dashboard (route-like, no router yet)
  App.css           # All component styles
  index.css         # CSS reset + design tokens (--orange, --blue, etc.)
```

## Auth Flow

- `AuthContext` loads the current Supabase session on mount and subscribes to auth state changes.
- `App.jsx` renders a loading state → sign-in/sign-up form → dashboard based on `user` value (`undefined` = loading, `null` = signed out, object = signed in).
- Supabase sends a confirmation email on sign-up; the user must confirm before they can sign in.

## Design Tokens

Defined in `src/index.css` as CSS custom properties:

- `--orange` / `--orange-dark` / `--orange-light` — primary action color
- `--blue` / `--blue-dark` / `--blue-light` — brand/nav color

## Supabase Setup (first time)

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Authentication → Providers** — email is enabled by default
3. Copy **Project URL** and **anon public key** from **Settings → API** into `.env.local`
4. (Optional) Disable email confirmation during development: **Authentication → Email Templates → Confirm signup → off**

## Planned Features

- Student profiles (coach-student relationship via Supabase RLS)
- Swing session logging with metrics
- Video upload via Supabase Storage
- Google OAuth sign-in
