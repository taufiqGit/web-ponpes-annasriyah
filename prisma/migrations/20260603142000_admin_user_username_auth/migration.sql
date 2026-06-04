CREATE TABLE IF NOT EXISTS "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'SUPERADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "AdminUser"
ADD COLUMN IF NOT EXISTS "username" TEXT;

UPDATE "AdminUser"
SET "username" = COALESCE(NULLIF(split_part("email", '@', 1), ''), "id")
WHERE "username" IS NULL;

ALTER TABLE "AdminUser"
ALTER COLUMN "username" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "AdminUser_email_key" ON "AdminUser"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "AdminUser_username_key" ON "AdminUser"("username");

INSERT INTO "AdminUser" ("id", "email", "username", "passwordHash", "role")
SELECT
  'admin-default-user',
  'admin@annasriyah.local',
  'admin',
  '$2b$10$7a/AN2ARphcFrH02eg/.guhfGcU55YkiM4FkbnEzIdek1sDDEnh1y',
  'SUPERADMIN'
WHERE NOT EXISTS (
  SELECT 1
  FROM "AdminUser"
  WHERE "username" = 'admin'
);
