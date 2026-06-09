# Project Status

Documentation Version: 0.2.0
Last Updated: 2026-06-09 17:38 BST
Status: Current platform state after full documentation audit.

## Overview

ReviewReply Pro is a live MVP for UK businesses to manage reviews and prepare replies. The platform is deployed on Vercel, uses Google OAuth for authorised admin access, stores data through Prisma, and supports real pilot customer workflows through manual review entry and reply management.

The product is usable for a pilot customer end to end when the workflow is manual:

1. Admin signs in with Google.
2. Admin views assigned business/location data.
3. Admin adds a review manually.
4. Admin generates reply options.
5. Admin edits, copies, saves, marks posted, or archives.
6. Admin returns later and sees stored history.

## Route Audit Summary

Implemented public routes:

- `/`
- `/demo`
- `/pricing`
- `/pilot`
- `/pilot/thank-you`
- `/login`

Implemented protected app routes:

- `/app`
- `/app/reviews`
- `/app/reviews/[id]`
- `/app/generate`
- `/app/saved-replies`
- `/app/brand-voice`
- `/app/integrations`
- `/app/billing`
- `/app/settings`
- `/app/setup`

Implemented admin routes:

- `/admin`
- `/admin/login`
- `/admin/blocked`
- `/admin/accounts`
- `/admin/users`
- `/admin/leads`
- `/admin/documentation`

Implemented API routes:

- `/api/auth/google/start`
- `/api/auth/google/callback`
- `/api/auth/logout`
- `/api/replies`
- `/api/stripe/checkout`
- `/api/stripe/webhook`

Implemented differently:

- `/api/stripe/*` routes are scaffolded placeholders.
- `/api/replies` can call OpenAI, but the main review workflow still uses the local provider fallback.

## Implemented Features

### Authentication

Implemented:

- Google OAuth login.
- Authorised `AdminUser` records.
- Initial Super Admin: `hussain.dadu@gmail.com`.
- Super Admin and Business Admin roles.
- Signed HTTP-only admin session cookie.
- Disabled/unknown users blocked from admin access.
- `/app` and `/admin/*` route protection.

### Businesses

Implemented:

- Workspace-backed business accounts.
- Account types: Demo, Pilot, Customer.
- Plan fields including Demo Free, Pilot, Free for Life and Paid.
- Billing status fields including mock billing, exempt, active and past due.
- Monthly price storage in pence.
- Active/inactive flag.
- Super Admin account creation and editing.
- Demo-only account deletion.

### Locations

Implemented:

- Location records linked to workspaces.
- Business name, business type, location name, address, phone, website, rating, review count and price range.
- GBP readiness fields.
- Super Admin location creation and editing.
- Demo-only location deletion.

### Reviews

Implemented:

- Manual review creation.
- Review inbox.
- Review detail view.
- Filters for location, status and rating.
- Search.
- Newest/oldest sort.
- Statuses: new, draft ready, edited, copied, posted and archived.
- Customer name, rating, review text, source, sentiment and received date storage.

### AI Replies

Implemented:

- Generate three reply options from the review workflow.
- Store generated replies.
- Select a reply option.
- Edit selected reply.
- Copy reply and mark copied.
- Mark reply as posted.
- Archive review.
- Save reply to saved replies.
- Brand voice settings are passed into reply generation.
- `/api/replies` can call OpenAI when configured.

Implemented differently:

- The main review workflow currently uses the local provider fallback rather than the OpenAI-capable API route.

### Leads

Implemented:

- Public pilot lead capture page.
- Lead storage in the database.
- Thank-you page.
- Super Admin leads page.
- Search and status filters.
- Status updates.
- Lead KPI cards.

### Pilot Customers

Implemented:

- Pilot account type.
- Free for Life plan.
- Masjid As-Salaam protected pilot account.
- Pilot/customer deletion protection.
- Pilot/customer data kept out of public demo pages.

### Admin

Implemented:

- Super Admin overview.
- Admin accounts page.
- Admin users page.
- Admin leads page.
- Super Admin documentation page.
- Business Admin workspace scoping.
- Pilot Customer and Free for Life badges.

### Documentation

Implemented:

- README.
- Product Overview.
- Admin Guide.
- Pilot Customers.
- Technical Notes.
- Changelog.
- Project Status.
- Super Admin documentation browser.
- Documentation version metadata.
- Last updated metadata.
- Documentation health check sections.

## In Progress Features

In Progress:

- OpenAI provider alignment for the main review workflow.
- Admin overview conversion to database-only reporting.
- Pilot customer onboarding refinement.
- Safer lead-to-pilot conversion workflow.
- More complete Business Admin permission testing.

## Planned Features

Planned:

- Google Business Profile OAuth for review sync.
- Google review import.
- Reply posting support or guided posting status from GBP.
- Stripe checkout sessions.
- Stripe webhook verification.
- Monthly subscription status sync.
- Email notifications.
- Automated test suite.
- Production support runbook.
- Advanced analytics.

## Known Issues

Known Issues:

- `next build` passes but Turbopack reports a non-blocking filesystem trace warning for the admin markdown reader.
- The main server action AI provider currently returns local fallback replies even when `OPENAI_API_KEY` exists.
- Admin overview includes legacy static demo/customer data in some high-level reporting.
- No `npm test` script exists.
- Stripe routes are placeholders.
- Google Business Profile sync is not implemented.

## Technical Debt

Technical Debt:

- Align `OpenAIReplyProvider` with `/api/replies` or move OpenAI generation into a shared server-side service.
- Replace all remaining static admin reporting arrays with database queries.
- Add tests for auth redirects, role access, review workflow, lead capture and account protection.
- Add a migration/runbook process for Turso production schema changes.
- Consider storing docs content in a build-safe static import pattern if the Turbopack warning becomes problematic.

## Next Priorities

Next Priorities:

1. Make main workflow AI generation call OpenAI when configured.
2. Remove legacy static data from admin reporting.
3. Add automated workflow tests.
4. Build lead-to-pilot conversion.
5. Add production runbook and migration checklist.

## Pilot Customers

Implemented:

- Masjid As-Salaam is a protected Pilot Customer with Free for Life access.
- Pilot account records are protected from deletion.
- Pilot data is not public demo content.

In Progress:

- Additional pilot onboarding and operational refinement.

## Current Deployment

Implemented:

- Production is deployed on Vercel.
- Current production alias: `https://reviewreply-pro-sand.vercel.app`.
- GitHub repository: `daduh02/ReviewReplyPro`.
- Production route `/admin/documentation` is protected.

## Environment Variables

Implemented:

- `DATABASE_URL`
- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `ADMIN_SESSION_SECRET`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`

Planned or scaffolded:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_STARTER_PRICE_ID`
- `STRIPE_PRO_PRICE_ID`

## Open Questions

Open Questions:

- Should seeded pilot customer constants remain code-owned, or should all real pilot data become admin/database-only?
- Should OpenAI generation be called directly from server actions or through the `/api/replies` route?
- What is the exact first paid plan price and billing policy?
- Which pilot businesses should receive Business Admin access first?
- What minimum automated test suite should block production deploys?

## Documentation Health Check

Missing docs:

- Automated test plan.
- Production runbook.
- Google Business Profile integration implementation plan.
- Stripe billing implementation plan.
- Data retention and privacy policy.

Outdated docs:

- None after this audit.

Docs requiring review:

- README after OpenAI provider alignment.
- Technical Notes after GBP sync implementation.
- Admin Guide after Stripe billing automation.
- Pilot Customers after pilot data ownership is decided.
