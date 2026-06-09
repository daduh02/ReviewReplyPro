# Changelog

## Initial MVP

Implemented:

- Public homepage, demo and pricing pages.
- Review inbox concept.
- Manual review entry.
- Three reply options per review.
- Edit, copy, save, post and archive workflow.
- Brand voice settings.
- Saved replies.
- SQLite/Turso persistence.
- Vercel deployment.

## Masjid As-Salaam Pilot Account

Implemented:

- Added Masjid As-Salaam as a real Pilot Customer.
- Configured Free for Life plan.
- Set billing status to exempt.
- Removed from public demo/sample content.
- Protected pilot/customer records from demo reset logic.

## Google OAuth

Implemented:

- Google OAuth admin login.
- Authorised admin users only.
- Initial Super Admin: `hussain.dadu@gmail.com`.
- Super Admin and Business Admin roles.
- Admin Users page.
- Business Admin workspace scoping.

Originally planned:

- Google OAuth was planned as the first authentication milestone.

Current status:

- Implemented for admin/customer access.

## Lead Capture

Implemented:

- Public `/pilot` form.
- Lead persistence.
- Super Admin leads page.
- Lead status updates.
- Lead KPI cards.

Originally planned:

- Lead capture was planned to support pilot recruitment.

Current status:

- Implemented as lightweight lead management, not a full CRM.

## Admin Documentation

Implemented:

- Repo documentation under `/docs`.
- Super Admin documentation page inside the admin area.
- Documentation is not publicly exposed.

Originally planned:

- Admin documentation section similar to the Trek4Africa admin documentation area.

Current status:

- Implemented.

## Upcoming

Planned:

- Real Google Business Profile review sync.
- Stripe billing automation.
- Email notifications.
- More complete automated test coverage.

