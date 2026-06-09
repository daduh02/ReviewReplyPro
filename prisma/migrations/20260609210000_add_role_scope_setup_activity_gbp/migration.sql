CREATE TABLE IF NOT EXISTS "admin_workspace_access" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "admin_user_id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "admin_workspace_access_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "admin_users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "admin_workspace_access_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "Workspace" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "admin_workspace_access_admin_user_id_workspace_id_key" ON "admin_workspace_access"("admin_user_id", "workspace_id");

ALTER TABLE "Workspace" ADD COLUMN "setup_completed_at" DATETIME;
ALTER TABLE "Workspace" ADD COLUMN "reply_notification_email" TEXT;

ALTER TABLE "Location" ADD COLUMN "google_place_id" TEXT;
ALTER TABLE "Location" ADD COLUMN "google_account_id" TEXT;
ALTER TABLE "Location" ADD COLUMN "google_location_id" TEXT;
ALTER TABLE "Location" ADD COLUMN "gbp_sync_enabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Location" ADD COLUMN "last_gbp_import_attempt_at" DATETIME;

CREATE TABLE IF NOT EXISTS "activity_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workspace_id" TEXT NOT NULL,
    "location_id" TEXT,
    "review_id" TEXT,
    "admin_user_id" TEXT,
    "event_type" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "activity_events_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "Workspace" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "activity_events_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "activity_events_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "Review" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "activity_events_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "admin_users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
