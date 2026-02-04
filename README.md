# HustleTracker

Track income across multiple side hustles with goal tracking. Built with Next.js 14, Supabase, and Tailwind CSS.

## Features

- **Authentication**: Email/password + Google OAuth
- **Dashboard**: Monthly income summary, goal progress, top hustles chart
- **Income Logging**: Quick-select hustles, amount, date, and notes
- **Hustle Management**: Create, edit, delete hustles with color-coded categories
- **History**: Filter entries by hustle and month, edit/delete entries
- **Settings**: Profile, currency, monthly goal, theme toggle
- **Responsive**: Mobile-first design with bottom navigation
- **Dark Mode**: Full dark mode support

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Validation**: Zod
- **Date Handling**: date-fns

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/hellopleasures/HustleTracker.git
cd HustleTracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the migration:

```sql
-- Copy contents from supabase/migrations/00001_initial_schema.sql
```

3. (Optional) Enable Google OAuth in Authentication > Providers > Google

### 4. Configure environment variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Public auth routes
│   │   ├── login/
│   │   ├── signup/
│   │   └── callback/
│   ├── (protected)/      # Protected routes
│   │   ├── dashboard/
│   │   ├── log/
│   │   ├── hustles/
│   │   ├── history/
│   │   └── settings/
│   ├── layout.tsx
│   └── page.tsx          # Landing page
├── components/
│   ├── ui/               # Reusable UI components
│   ├── auth/             # Auth forms
│   ├── dashboard/        # Dashboard widgets
│   ├── income/           # Income form
│   ├── hustles/          # Hustle management
│   ├── history/          # History list/filters
│   └── layout/           # Navigation components
├── lib/
│   ├── supabase/         # Supabase clients
│   ├── actions/          # Server actions
│   └── utils/            # Helper functions
├── contexts/             # React contexts
├── types/                # TypeScript types
└── middleware.ts         # Auth middleware
```

## Deploy to Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

## License

MIT
