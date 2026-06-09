CREATE TYPE "AdminRole" AS ENUM ('super_admin', 'business_admin');

CREATE TYPE "AdminStatus" AS ENUM ('active', 'disabled');

CREATE TABLE "admin_users" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT,
  "role" "AdminRole" NOT NULL DEFAULT 'business_admin',
  "status" "AdminStatus" NOT NULL DEFAULT 'active',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "last_login_at" TIMESTAMP(3),

  CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

INSERT INTO "admin_users" ("id", "email", "name", "role", "status")
VALUES ('admin_hussain_dadu', 'hussain.dadu@gmail.com', 'Hussain Dadu', 'super_admin', 'active')
ON CONFLICT ("email") DO UPDATE SET
  "role" = 'super_admin',
  "status" = 'active';
