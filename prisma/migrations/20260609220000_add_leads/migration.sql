CREATE TABLE IF NOT EXISTS "leads" (
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
