-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'business_admin',
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login_at" DATETIME
);

-- CreateTable
CREATE TABLE "admin_workspace_access" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "admin_user_id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "admin_workspace_access_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "admin_users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "admin_workspace_access_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "Workspace" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "account_type" TEXT NOT NULL DEFAULT 'demo',
    "plan" TEXT NOT NULL DEFAULT 'Demo Free',
    "billing_status" TEXT NOT NULL DEFAULT 'mock_billing',
    "billing_interval" TEXT NOT NULL DEFAULT 'monthly',
    "monthly_price_pence" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "setup_completed_at" DATETIME,
    "reply_notification_email" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Workspace_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workspaceId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "businessType" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT NOT NULL,
    "phone" TEXT,
    "website" TEXT,
    "googleRating" REAL,
    "googleReviewCount" INTEGER,
    "priceRange" TEXT,
    "googleBusinessStatus" TEXT NOT NULL DEFAULT 'Google Business Profile integration coming soon',
    "google_place_id" TEXT,
    "google_account_id" TEXT,
    "google_location_id" TEXT,
    "gbp_sync_enabled" BOOLEAN NOT NULL DEFAULT false,
    "last_gbp_import_attempt_at" DATETIME,
    CONSTRAINT "Location_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BrandVoiceSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workspaceId" TEXT NOT NULL,
    "location_id" TEXT,
    "preferredTone" TEXT NOT NULL,
    "defaultLength" TEXT NOT NULL,
    "greetingStyle" TEXT,
    "signOffStyle" TEXT,
    "wordsToUse" TEXT,
    "wordsToAvoid" TEXT,
    "complaintHandlingStyle" TEXT,
    "useEmojis" BOOLEAN NOT NULL DEFAULT false,
    "mentionBusinessName" BOOLEAN NOT NULL DEFAULT true,
    "apologiseForPoorExperiences" BOOLEAN NOT NULL DEFAULT true,
    "inviteUnhappyCustomersToContact" BOOLEAN NOT NULL DEFAULT true,
    "keepRepliesShortByDefault" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "BrandVoiceSetting_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BrandVoiceSetting_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "locationId" TEXT NOT NULL,
    "customerName" TEXT,
    "starRating" INTEGER NOT NULL,
    "reviewText" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "sentiment" TEXT NOT NULL,
    "receivedAt" DATETIME NOT NULL,
    "selected_reply_id" TEXT,
    "edited_reply" TEXT,
    "last_edited_at" DATETIME,
    "copied_at" DATETIME,
    "posted_at" DATETIME,
    "archived_at" DATETIME,
    "actioned_by_email" TEXT,
    CONSTRAINT "Review_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GeneratedReply" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reviewId" TEXT NOT NULL,
    "variant" INTEGER NOT NULL,
    "tone" TEXT NOT NULL,
    "length" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "generation_source" TEXT NOT NULL DEFAULT 'fallback',
    "selected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GeneratedReply_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SavedReply" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workspaceId" TEXT NOT NULL,
    "reviewId" TEXT,
    "body" TEXT NOT NULL,
    "tone" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SavedReply_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SavedReply_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Integration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workspaceId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "metadata" JSONB,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Integration_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GoogleBusinessConnection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workspaceId" TEXT NOT NULL,
    "googleAccountId" TEXT,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "connected" BOOLEAN NOT NULL DEFAULT false,
    "lastSyncedAt" DATETIME,
    CONSTRAINT "GoogleBusinessConnection_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workspaceId" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "currentPeriodEnd" DATETIME,
    CONSTRAINT "Subscription_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UsageEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workspaceId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UsageEvent_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "business_name" TEXT NOT NULL,
    "business_type" TEXT NOT NULL,
    "number_of_locations" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "mobile_number" TEXT,
    "current_review_platform" TEXT NOT NULL,
    "average_reviews_per_month" TEXT NOT NULL,
    "biggest_challenge" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "activity_events" (
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

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admin_workspace_access_admin_user_id_workspace_id_key" ON "admin_workspace_access"("admin_user_id", "workspace_id");

-- CreateIndex
CREATE UNIQUE INDEX "BrandVoiceSetting_location_id_key" ON "BrandVoiceSetting"("location_id");

-- CreateIndex
CREATE UNIQUE INDEX "BrandVoiceSetting_workspaceId_location_id_key" ON "BrandVoiceSetting"("workspaceId", "location_id");

-- CreateIndex
CREATE UNIQUE INDEX "GoogleBusinessConnection_workspaceId_key" ON "GoogleBusinessConnection"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_workspaceId_key" ON "Subscription"("workspaceId");

-- Seed Super Admin
INSERT INTO "admin_users" ("id", "email", "name", "role", "status")
VALUES ('admin_hussain_dadu', 'hussain.dadu@gmail.com', 'Hussain Dadu', 'super_admin', 'active')
ON CONFLICT ("email") DO UPDATE SET
  "role" = 'super_admin',
  "status" = 'active';
