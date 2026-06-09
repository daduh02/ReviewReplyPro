# Changelog

Documentation Version: 0.2.0
Last Updated: 2026-06-09 17:38 BST
Status: Current platform state after documentation audit.

## Initial MVP

Implemented:

- Public homepage, demo and pricing pages.
- Google OAuth admin login.
- Protected app and admin routes.
- Review inbox.
- Manual review entry.
- Three reply options per review.
- Edit, copy, save, post and archive workflow.
- Brand voice settings.
- Saved replies.
- Activity tracking.
- SQLite/Turso persistence.
- Vercel deployment.

## Masjid As-Salaam Pilot Account

Implemented:

- Added Masjid As-Salaam as a real Pilot Customer.
- Configured Free for Life plan.
- Set billing status to exempt.
- Removed from public demo/sample content.
- Protected pilot/customer records from demo deletion rules.

## Google OAuth

Implemented:

- Google OAuth admin login.
- Authorised admin users only.
- Initial Super Admin: `hussain.dadu@gmail.com`.
- Super Admin and Business Admin roles.
- Admin Users page.
- Business Admin workspace scoping.

## Lead Capture

Implemented:

- Public `/pilot` form.
- Lead persistence.
- Super Admin leads page.
- Lead status updates.
- Lead KPI cards.

Planned:

- Convert lead to account workflow.

## Admin Documentation

Implemented:

- Repo documentation under `/docs`.
- Super Admin documentation page inside the admin area.
- Documentation is not publicly exposed.
- Project Status page added.
- Documentation audit metadata added.

## Billing

Implemented:

- Account plan, billing status, billing interval and monthly price fields.
- Billing page and placeholder checkout API.

Implemented differently:

- Stripe checkout and webhooks are placeholders, not real subscription automation.

Planned:

- Real Stripe checkout sessions.
- Webhook signature verification.
- Subscription status sync.

## Google Business Profile

Implemented:

- GBP readiness fields on locations.
- UI wording that GBP integration is coming soon.

Planned:

- Real GBP OAuth for review sync.
- Review import.
- Reply posting support or posting guidance.

## Documentation Audit

Implemented:

- Added status labels across documentation.
- Added documentation version and last updated metadata.
- Added documentation health check sections.
- Added `docs/PROJECT_STATUS.md`.

## Upcoming

In Progress:

- Real pilot customer testing.
- OpenAI provider alignment.
- Admin reporting cleanup.

Planned:

- Real Google Business Profile review sync.
- Stripe billing automation.
- Email notifications.
- Automated test coverage.

## Documentation Health Check

Missing docs:

- Test plan.
- Production runbook.
- Billing implementation plan.

Outdated docs:

- None after this audit.

Docs requiring review:

- Changelog after the next shipped production feature.
