CREATE TYPE "AccountType" AS ENUM ('demo', 'pilot', 'customer');

CREATE TYPE "BillingStatus" AS ENUM ('mock_billing', 'exempt', 'active', 'past_due');

ALTER TABLE "Workspace"
  ADD COLUMN "account_type" "AccountType" NOT NULL DEFAULT 'demo',
  ADD COLUMN "plan" TEXT NOT NULL DEFAULT 'Demo Free',
  ADD COLUMN "billing_status" "BillingStatus" NOT NULL DEFAULT 'mock_billing',
  ADD COLUMN "active" BOOLEAN NOT NULL DEFAULT true;

UPDATE "Workspace"
SET
  "account_type" = 'pilot',
  "plan" = 'Free for Life',
  "billing_status" = 'exempt',
  "active" = true
WHERE lower("name") = lower('Masjid As-Salaam');

UPDATE "Workspace"
SET
  "account_type" = 'pilot',
  "plan" = 'Pilot',
  "billing_status" = 'exempt',
  "active" = true
WHERE lower("name") IN (
  lower('Ashpazi - Charcoal Kitchen'),
  lower('Gardner Champion Solicitors Ltd')
);
