ALTER TABLE "Location" ADD COLUMN "phone" TEXT;
ALTER TABLE "Location" ADD COLUMN "website" TEXT;
ALTER TABLE "Location" ADD COLUMN "googleRating" REAL;
ALTER TABLE "Location" ADD COLUMN "googleReviewCount" INTEGER;
ALTER TABLE "Location" ADD COLUMN "priceRange" TEXT;
ALTER TABLE "Location" ADD COLUMN "googleBusinessStatus" TEXT NOT NULL DEFAULT 'Google Business Profile integration coming soon';
