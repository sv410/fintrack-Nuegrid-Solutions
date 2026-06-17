# FinTrack — Mini Fintech Dashboard

A sleek personal finance tracker built with React, Express, and PostgreSQL. Log transactions, view summaries, explore spending charts, and get AI-powered insights.

---

## ✅ Assignment Checklist

| Feature | Status |
|---|---|
| Add a transaction (amount, category, type, date, optional note) | ✅ Done |
| List transactions with filters (category, type, date range) | ✅ Done |
| Summary view (total income, total expense, net balance, top category) | ✅ Done |
| Chart showing spending by category (bar + pie toggle) | ✅ Done |
| Rule-based spending insight | ✅ Done |
| AI-powered insight (GPT-4o-mini, optional) | ✅ Done |
| Login / Signup pages | ✅ Done |
| Vercel-deployable codebase | ✅ Done |

---

## Tech Stack

- **Frontend**: React 19 + Vite + TailwindCSS + Recharts + TanStack Query
- **Backend**: Express 5 + Drizzle ORM + PostgreSQL
- **AI**: OpenAI GPT-4o-mini (optional, falls back to rule-based)
- **Auth**: localStorage-based demo auth
- **Deployment**: Vercel (frontend static + API serverless function)

---

## Local Development

### Prerequisites
- Node.js 18+
- pnpm 10+
- PostgreSQL database

### 1. Clone and install

```bash
git clone <your-repo-url>
cd fintrack
pnpm install
```

### 2. Set environment variables

Create a `.env` file (or set these in your shell):

```env
# Required — PostgreSQL connection string
DATABASE_URL=postgresql://user:password@localhost:5432/fintrack

# Optional — enables AI-powered insights (falls back to rule-based if missing)
OPENAI_API_KEY=sk-...
```

### 3. Run database migrations

```bash
pnpm --filter @workspace/db run push
```

### 4. Seed sample data (optional)

```bash
pnpm --filter @workspace/db run seed
```

### 5. Start development servers

In two terminals:

```bash
# Terminal 1 — API server (port 8080)
pnpm --filter @workspace/api-server run dev

# Terminal 2 — Frontend (port 3000)
BASE_PATH=/ PORT=3000 pnpm --filter @workspace/finance-dashboard run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Vercel Deployment

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/fintrack.git
git push -u origin main
```

### 2. Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import [sv410/fintrack-Nuegrid-Solutions](https://github.com/sv410/fintrack-Nuegrid-Solutions)
2. **Root Directory** must be the repo root (leave blank) — do **not** set it to `artifacts/api-server`
3. Under **Build & Output Settings**, turn **off** the Output Directory override (leave it empty). If it is set to `artifacts/finance-dashboard/dist/public`, Vercel will fail with a “No entrypoint found” error.
4. Set the following **Environment Variables** in your Vercel project settings:

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection string (e.g. from [Neon](https://neon.tech) or [Supabase](https://supabase.com)) |
| `OPENAI_API_KEY` | ❌ Optional | Enables AI insights; falls back to rule-based if absent |

### 3. Deploy

Click **Deploy**. Vercel will:
- Install dependencies with `pnpm install`
- Build the frontend static files
- Bundle `api/handler.ts` as a serverless function
- Route `/api/*` to the serverless function and everything else to the SPA

> **Tip**: Use [Neon](https://neon.tech) for a free serverless PostgreSQL database compatible with Vercel.

---

## Project Structure

```
fintrack/
├── artifacts/
│   ├── api-server/        # Express API (routes, app, index)
│   └── finance-dashboard/ # React + Vite frontend
├── lib/
│   ├── db/                # Drizzle ORM schema + client
│   ├── api-zod/           # Shared Zod validation schemas
│   └── api-client-react/  # Generated TanStack Query hooks
├── api/
│   └── handler.ts         # Vercel serverless function wrapper
└── vercel.json            # Vercel deployment config
```

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/transactions` | List transactions (supports `?category=&type=&startDate=&endDate=`) |
| `POST` | `/api/transactions` | Create a transaction |
| `DELETE` | `/api/transactions/:id` | Delete a transaction |
| `GET` | `/api/transactions/summary` | Total income, expense, balance, top category |
| `GET` | `/api/transactions/by-category` | Spending grouped by category |
| `GET` | `/api/transactions/insight` | AI or rule-based spending insight |

---

## License

MIT
