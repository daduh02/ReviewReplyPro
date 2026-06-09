# Technical Notes

## Data Model Summary

Implemented Prisma models include:

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

Key account fields:

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

## Google OAuth Notes

Implemented routes:

- `/api/auth/google/start`
- `/api/auth/google/callback`
- `/api/auth/logout`

Required Google redirect URI format:

```text
https://reviewreply-pro-sand.vercel.app/api/auth/google/callback
```

The Google OAuth button uses a normal anchor to avoid framework prefetch trying to fetch the external Google redirect as an RSC request.

## OpenAI Reply Generation Notes

Implemented:

- `/api/replies` can call OpenAI chat completions when `OPENAI_API_KEY` is present.
- If OpenAI is not configured or fails, the app falls back to local mock reply generation.
- Server actions generate and persist three reply options against a review.

Prompt requirements:

- British English
- Use business/location brand voice
- Avoid arguing with reviewers
- Avoid legal liability language
- Invite direct contact for complaints
- Use respectful community wording for mosque/community organisations

## Google Business Profile Readiness Fields

Implemented on `Location`:

- `google_place_id`
- `google_account_id`
- `google_location_id`
- `gbp_sync_enabled`
- `last_gbp_import_attempt_at`
- `googleBusinessStatus`

Not implemented:

- Real review import
- Real location listing
- Sync scheduling
- Posting replies back to Google

## Lead Capture Model

Implemented:

- Public `/pilot` form
- `Lead` table
- Admin `/admin/leads` page
- Lead statuses and KPI cards

Lead fields:

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

## Deployment and Vercel Notes

Implemented:

- Production deploys to Vercel.
- Production data uses Turso/libSQL.
- Local data uses SQLite.
- Prisma Client is generated on install.

Deployment checklist:

1. Run `npm run typecheck`.
2. Run `npm run lint`.
3. Run `npm run build`.
4. Apply new SQL migrations to Turso.
5. Push to GitHub.
6. Confirm Vercel production deployment.
7. Smoke test desktop, tablet and phone.

## Known Gaps and Risks

Known gaps:

- No automated test suite yet.
- No real GBP review sync yet.
- No automated Stripe billing lifecycle yet.
- No email notifications yet.
- Some public demo components still use client-side local demo state for demonstration only.

Risks:

- Manual SQL migrations must be applied carefully to Turso.
- OpenAI fallback can hide provider failures if monitoring is not added.
- Business Admin scoping should be tested thoroughly as more customers are added.

