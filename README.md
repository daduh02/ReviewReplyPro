# ReviewReply Pro

Documentation Version: 0.3.0
Last Updated: 2026-06-09 17:57 BST
Status: Implemented / In Progress / Planned aligned after documentation audit.

## Overview

ReviewReply Pro is a UK-focused SaaS platform for local businesses that need a practical way to manage customer reviews and prepare professional replies.

The current MVP is centred on a protected, database-backed pilot workflow:

1. Sign in with Google as an authorised admin.
2. View assigned business locations.
3. Add reviews manually.
4. Generate or regenerate three reply options.
5. Select, edit, copy, save, mark posted, or archive a reply.
6. Return later with reviews, replies, saved replies, brand voice settings, leads and activity history retained.

## UK SaaS Positioning

Implemented:

- UK wording, UK English reply guidance and GBP pricing.
- Local service business positioning.
- Manual review workflow while Google Business Profile sync is pending.
- Pilot/customer account model for real business testing.

In Progress:

- Real pilot workflow refinement from customer use.
- More precise operational copy as pilot feedback comes in.

Planned:

- Full Google Business Profile review import.
- Stripe-backed monthly billing automation for paid customers.
- Email notifications.

## Target Customers

Implemented target categories:

- Restaurants and takeaways
- Salons, beauty studios and barbers
- Dental practices and healthcare-adjacent local services
- Solicitors and professional services
- Garages and trades
- Estate agents
- Mosques, charities and community organisations

## Current MVP Status

Implemented:

- Google OAuth admin login.
- Authorised admin-only access.
- Super Admin and Business Admin roles.
- Business Admin workspace scoping.
- Prisma-backed persistence for workspaces, locations, reviews, generated replies, saved replies, brand voice settings, leads, admin users and activity events.
- SQLite locally and Turso/libSQL in production.
- Pilot/customer account types.
- Protected Pilot and Customer account deletion rules.
- Masjid As-Salaam seeded as a protected Free for Life Pilot Customer.
- Manual review entry.
- Review inbox filtering by location, status, rating, search and newest/oldest sort.
- Review detail workflow: generate, select, edit, save, copy, mark posted and archive.
- Main review workflow uses OpenAI when `OPENAI_API_KEY` is configured.
- Local reply fallback is retained for missing keys, OpenAI request failures and local development.
- Generated replies store `generation_source` as `openai` or `fallback`.
- Super Admin can see a small generation-source label on reply options.
- Activity/audit records for review and reply workflow actions.
- Location-level brand voice settings.
- Dashboard KPIs including total reviews, awaiting response, responded to, average rating and response rate.
- First-time business setup wizard.
- Lead capture form and Super Admin lead management.
- Google Business Profile readiness fields.
- Authenticated dashboards and admin reporting use database-backed real pilot/customer data only.
- Admin documentation area protected for Super Admin users.
- Vercel production deployment.

In Progress:

- Pilot testing with real businesses.
- Hardening AI reply generation and provider behaviour.
- Refining Business Admin onboarding and scoped access.
- Admin reporting consistency.

Planned:

- Real Google Business Profile review sync.
- Real Google Business Profile reply posting.
- Stripe subscription creation and webhook verification.
- Email notifications.
- Automated end-to-end test suite.
- More granular Business Admin permissions.

## Tech Stack

Implemented:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite for local development
- Turso/libSQL for production through Prisma libSQL adapter
- Google OAuth for admin authentication
- OpenAI-backed reply generation in the main review workflow
- Local reply fallback when OpenAI is unavailable
- Vercel deployment

## Local Setup

Implemented:

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

Known gap:

- There is currently no `npm test` script.

## Environment Variables

Implemented local database:

```bash
DATABASE_URL="file:./dev.db"
```

Implemented production database:

```bash
DATABASE_URL="file:./dev.db"
TURSO_DATABASE_URL="libsql://your-database.turso.io"
TURSO_AUTH_TOKEN="your-turso-token"
```

Implemented Google OAuth:

```bash
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ADMIN_SESSION_SECRET="replace-with-a-long-random-secret"
```

Implemented optional AI generation:

```bash
OPENAI_API_KEY="your-openai-api-key"
OPENAI_MODEL="gpt-4o-mini"
```

Planned or scaffolded billing variables:

```bash
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

Implemented:

- Production deploys on Vercel.
- Live production alias is `https://reviewreply-pro-sand.vercel.app`.
- Production data uses Turso/libSQL when `TURSO_DATABASE_URL` is set.
- `/app` and `/admin/*` routes require an authorised admin session.
- `/admin/documentation` is Super Admin-only.
- Raw `/docs/*.md` files are not publicly served.

Current build note:

- `next build` succeeds.
- Turbopack emits a non-blocking warning because the admin documentation page reads repo markdown files from the filesystem.

## Current Limitations

Implemented differently from a final SaaS:

- Stripe routes are placeholders and return mock/scaffolded responses.
- Google Business Profile fields exist, but sync and posting are not implemented.
- Some public demo pages still use static fictional sample data.
- Public demo data is separated from authenticated pilot/customer and Super Admin reporting.

In Progress:

- Pilot onboarding workflow refinement.
- Production migration/runbook documentation.

Planned:

- GBP OAuth for review sync.
- Stripe billing automation.
- Email notifications.
- Automated browser/end-to-end tests.

## Roadmap

Next priorities:

- Add automated workflow tests for login redirects, review generation, copy/post/archive and lead capture.
- Add safer customer conversion tooling from lead to pilot/customer.

Later:

- Real Google Business Profile import.
- Stripe monthly billing.
- Email alerts.
- Advanced analytics.

## Documentation Health Check

Missing docs:

- Automated test plan.
- Google Business Profile integration implementation plan.
- Stripe billing implementation plan.
- Operational runbook for production incidents.

Outdated docs:

- None after this audit.

Docs requiring review:

- Billing docs after Stripe is implemented.
- AI generation docs after provider observability or model routing changes.
- Admin reporting docs after the next reporting feature ships.

## Documentation

Detailed documentation is stored in `/docs` and is also available inside the Super Admin area:

- `docs/PROJECT_STATUS.md`
- `docs/PRODUCT_OVERVIEW.md`
- `docs/ADMIN_GUIDE.md`
- `docs/PILOT_CUSTOMERS.md`
- `docs/TECHNICAL_NOTES.md`
- `docs/CHANGELOG.md`
