ALTER TABLE "BrandVoiceSetting" ADD COLUMN "location_id" TEXT;

ALTER TABLE "Review" ADD COLUMN "selected_reply_id" TEXT;
ALTER TABLE "Review" ADD COLUMN "edited_reply" TEXT;
ALTER TABLE "Review" ADD COLUMN "last_edited_at" DATETIME;
ALTER TABLE "Review" ADD COLUMN "copied_at" DATETIME;
ALTER TABLE "Review" ADD COLUMN "posted_at" DATETIME;
ALTER TABLE "Review" ADD COLUMN "archived_at" DATETIME;
ALTER TABLE "Review" ADD COLUMN "actioned_by_email" TEXT;

ALTER TABLE "GeneratedReply" ADD COLUMN "updatedAt" DATETIME NOT NULL DEFAULT '1970-01-01 00:00:00';

DROP INDEX IF EXISTS "BrandVoiceSetting_workspaceId_key";
DELETE FROM "BrandVoiceSetting" WHERE "location_id" IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "BrandVoiceSetting_location_id_key" ON "BrandVoiceSetting"("location_id");
CREATE UNIQUE INDEX IF NOT EXISTS "BrandVoiceSetting_workspaceId_location_id_key" ON "BrandVoiceSetting"("workspaceId", "location_id");
