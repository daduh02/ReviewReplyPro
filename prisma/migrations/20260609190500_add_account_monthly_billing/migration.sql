ALTER TABLE "Workspace" ADD COLUMN "billing_interval" TEXT NOT NULL DEFAULT 'monthly';
ALTER TABLE "Workspace" ADD COLUMN "monthly_price_pence" INTEGER NOT NULL DEFAULT 0;
