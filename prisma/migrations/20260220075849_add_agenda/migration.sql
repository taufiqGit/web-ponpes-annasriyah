-- CreateEnum
CREATE TYPE "AgendaBadge" AS ENUM ('Pengajian', 'Olahraga', 'Lomba', 'Kunjungan', 'Lainnya');

-- CreateTable
CREATE TABLE "Agenda" (
    "id" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "badge" "AgendaBadge" NOT NULL,
    "status" "PublishStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agenda_pkey" PRIMARY KEY ("id")
);
