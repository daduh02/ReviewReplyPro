# Technical Notes

Documentation Version: 0.3.0
Last Updated: 2026-06-09 17:57 BST
Status: Current platform state after documentation audit.

## Data Model Summary

Implemented Prisma models:

- `AdminUser`
- `AdminWorkspaceAccess`
- `User`
- `Workspace`
- `Location`
- `BrandVoiceSetting`
- `Review`
- `GeneratedReply`
- `SavedReply`
- `Integration`
- `GoogleBusinessConnection`
- `Subscription`
- `UsageEvent`
- `ActivityEvent`
- `Lead`

Implemented account fields:

- `account_type`
- `plan`
- `billing_status`
- `billing_interval`
- `monthly_price_pence`
- `active`
- `setup_completed_at`

## Authentication Approach

Implemented:

- Google OAuth is used for admin/customer access.
- Admin session is stored in a signed HTTP-only cookie.
- `hussain.dadu@gmail.com` is seeded as the initial Super Admin.
- Unauthorised Google accounts are blocked.
- Business Admins are scoped through `AdminWorkspaceAccess`.

Not implemented:

- Public self-serve signup.
- Password login.
- Magic links.
- External auth provider SDK.

## Google OAuth Notes

Implemented routes:

- `/api/auth/google/start`
- `/api/auth/google/callback`
- `/api/auth/logout`

Required Google redirect URI format:

```text
https://reviewreply-pro-sand.vercel.app/api/auth/google/callback
```

Implemented behaviour:

- OAuth state is stored in a secure HTTP-only cookie.
- Login requires an existing active `AdminUser`.
- Disabled or unknown users are redirected away from admin access.
- The login button uses a normal link to avoid framework prefetch issues.

## OpenAI Reply Generation Notes

Implemented:

- `/api/replies` calls OpenAI chat completions when `OPENAI_API_KEY` is present.
- `/api/replies` falls back to local deterministic replies if OpenAI is missing, fails or returns invalid JSON.
- Review workflow server actions call the same OpenAI-capable provider and persist three reply options against a review.
- Generated replies use location brand voice inputs.
- Generated replies persist `generation_source` as `openai` or `fallback`.
- Super Admin can see the generation source on reply options.
- Reply actions create activity events.

Prompt requirements:

- British English.
- Use business/location brand voice.
- Avoid arguing with reviewers.
- Avoid legal liability language.
- Invite direct contact for complaints.
- Use respectful community wording for mosque/community organisations.

## Google Business Profile Readiness Fields

Implemented on `Location`:

- `google_place_id`
- `google_account_id`
- `google_location_id`
- `gbp_sync_enabled`
- `last_gbp_import_attempt_at`
- `googleBusinessStatus`

Not implemented:

- Real review import.
- Real location listing.
- Sync scheduling.
- Posting replies back to Google.

## Lead Capture Model

Implemented:

- Public `/pilot` form.
- `Lead` table.
- Admin `/admin/leads` page.
- Lead statuses and KPI cards.

Implemented lead fields:

- Name
- Business name
- Business type
- Number of locations
- Email
- Mobile number
- Current review platform
- Average reviews per month
- Biggest challenge
- Status

Planned:

- Convert lead to account workflow.

## Deployment and Vercel Notes

Implemented:

- Production deploys to Vercel.
- Production data uses Turso/libSQL when configured.
- Local data uses SQLite.
- Prisma Client is generated on install.
- Production alias is `https://reviewreply-pro-sand.vercel.app`.

Deployment checklist:

1. Run `npm run typecheck`.
2. Run `npm run lint`.
3. Run `npm run build`.
4. Apply new SQL migrations to Turso when schema changes.
5. Push to GitHub.
6. Deploy to Vercel production.
7. Smoke test protected routes.

Current build note:

- Build passes with a non-blocking Turbopack filesystem trace warning from the admin markdown reader.

## Known Gaps and Risks

Known gaps:

- No automated test suite.
- No real GBP review sync.
- No automated Stripe billing lifecycle.
- No email notifications.
- Public demo components still use static fictional demo state by design.
- Authenticated/admin areas no longer use static fictional demo businesses.

Risks:

- Manual SQL migrations must be applied carefully to Turso.
- Local fallback replies can hide OpenAI provider failures if monitoring is not added.
- Business Admin scoping should be tested thoroughly as more customers are added.
- Seeded pilot data can overwrite selected fields.

## Documentation Health Check

Missing docs:

- Test strategy.
- Production incident runbook.
- Database migration runbook.

Outdated docs:

- None after this audit.

Docs requiring review:

- Technical notes after GBP sync implementation.
