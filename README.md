# ReviewReply Pro

ReviewReply Pro is a UK-focused SaaS product for local businesses that need a simple, reliable way to manage customer reviews and prepare professional replies.

The MVP is centred on a protected review inbox. A business can add reviews manually, generate three reply options, edit the selected reply, copy it for Google, mark it as posted, save useful replies, and return later with history retained in the database.

## Positioning

ReviewReply Pro is built for UK local and service businesses that care about review reputation but do not want a full CRM or social media suite.

Target customers include:

- Restaurants and takeaways
- Salons, beauty studios and barbers
- Dental practices and healthcare-adjacent local services
- Solicitors and professional services
- Garages and trades
- Estate agents
- Mosques, charities and community organisations

## Current MVP Status

Implemented:

- Google OAuth admin login
- Authorised admin-only access
- Super Admin and Business Admin roles
- Business Admin workspace scoping
- Persistent database-backed workspaces, locations, reviews, generated replies, saved replies, brand voice settings and leads
- Pilot/customer account types
- Protected Pilot and Customer accounts
- Manual review entry
- Review inbox filtering by location, status, rating, search and sort
- Review detail workflow: generate, select, edit, save, copy, mark posted and archive
- Activity/audit records for reply workflow actions
- Location-level brand voice settings
- Dashboard KPIs including awaiting reply, replied, average rating and response rate
- First-time business setup wizard
- Lead capture form and Super Admin lead management
- Google Business Profile readiness fields
- Vercel production deployment

In progress:

- Real pilot business testing
- Refinement of admin/customer workflows from pilot feedback
- OpenAI prompt hardening and provider observability

Planned:

- Real Google Business Profile review sync
- More granular Business Admin permissions
- Stripe billing automation
- Email notifications
- Scheduled sync jobs and operational monitoring

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite for local development
- Turso/libSQL for production
- Google OAuth for admin authentication
- OpenAI-compatible reply generation provider with mock fallback
- Vercel deployment

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run db:reset:local
npm run dev
```

Open:

```text
http://localhost:3000
```

Useful commands:

```bash
npm run typecheck
npm run lint
npm run build
npm run db:reset:local
```

There is currently no `npm test` script.

## Environment Variables

Required for local database:

```bash
DATABASE_URL="file:./dev.db"
```

Required for production database:

```bash
DATABASE_URL="file:./dev.db"
TURSO_DATABASE_URL="libsql://your-database.turso.io"
TURSO_AUTH_TOKEN="your-turso-token"
```

Required for Google OAuth:

```bash
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ADMIN_SESSION_SECRET="replace-with-a-long-random-secret"
```

Optional:

```bash
OPENAI_API_KEY="your-openai-api-key"
OPENAI_MODEL="gpt-4o-mini"
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_STARTER_PRICE_ID=""
STRIPE_PRO_PRICE_ID=""
```

Google OAuth redirect URIs:

```text
http://localhost:3000/api/auth/google/callback
https://reviewreply-pro-sand.vercel.app/api/auth/google/callback
```

## Deployment Notes

The production app is deployed on Vercel and uses Turso/libSQL through Prisma's libSQL adapter.

Production deployment checklist:

- Push to `main`
- Confirm Vercel build succeeds
- Confirm `/app` and `/admin/*` routes redirect to `/admin/login` when unauthenticated
- Confirm `/api/auth/google/start` redirects to Google
- Confirm Turso schema migrations have been applied
- Run a browser smoke test for desktop, tablet and phone viewports

Current production URL:

```text
https://reviewreply-pro-sand.vercel.app
```

## Current Limitations

Implemented now:

- Manual review entry is active
- Google OAuth is active for admin/customer access
- OpenAI generation works when `OPENAI_API_KEY` is set, with mock fallback when absent
- Google Business Profile readiness fields are stored

Not implemented yet:

- Real Google Business Profile review sync
- Real Stripe subscription lifecycle automation
- Email notifications
- Advanced analytics
- Public self-serve signup
- Automated end-to-end test suite

## Roadmap

Near term:

- Continue pilot customer testing
- Improve Business Admin onboarding
- Add safer admin tooling for converting leads to pilot accounts
- Add clearer audit reporting inside admin

Next:

- Google Business Profile OAuth and review sync
- Reply posting guidance and sync status
- Email notifications for new reviews and generated replies

Later:

- Stripe billing automation
- More advanced reporting
- Multi-user customer workspace management

## Documentation

Detailed documentation is stored in `/docs` and is also available inside the Super Admin area:

- `docs/PRODUCT_OVERVIEW.md`
- `docs/ADMIN_GUIDE.md`
- `docs/PILOT_CUSTOMERS.md`
- `docs/TECHNICAL_NOTES.md`
- `docs/CHANGELOG.md`

