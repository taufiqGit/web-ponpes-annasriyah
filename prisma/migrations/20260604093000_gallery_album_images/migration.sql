-- CreateTable
CREATE TABLE "GalleryAlbum" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "eventDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT,

    CONSTRAINT "GalleryAlbum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryImage" (
    "id" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "storagePath" TEXT,
    "caption" TEXT,
    "takenAt" TIMESTAMP(3),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("id")
);

-- Move legacy single-image gallery items into album + image tables.
INSERT INTO "GalleryAlbum" (
    "id",
    "title",
    "description",
    "status",
    "publishedAt",
    "eventDate",
    "createdAt",
    "updatedAt",
    "categoryId"
)
SELECT
    "id",
    "title",
    "caption",
    "status",
    "publishedAt",
    "takenAt",
    "createdAt",
    "updatedAt",
    "categoryId"
FROM "GalleryItem";

INSERT INTO "GalleryImage" (
    "id",
    "albumId",
    "imageUrl",
    "storagePath",
    "caption",
    "takenAt",
    "sortOrder",
    "createdAt",
    "updatedAt"
)
SELECT
    "id" || '-image-1',
    "id",
    "imageUrl",
    NULL,
    "caption",
    "takenAt",
    0,
    "createdAt",
    "updatedAt"
FROM "GalleryItem";

-- CreateIndex
CREATE INDEX "GalleryImage_albumId_sortOrder_idx" ON "GalleryImage"("albumId", "sortOrder");

-- AddForeignKey
ALTER TABLE "GalleryAlbum" ADD CONSTRAINT "GalleryAlbum_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryImage" ADD CONSTRAINT "GalleryImage_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "GalleryAlbum"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "GalleryItem" DROP CONSTRAINT "GalleryItem_categoryId_fkey";

-- DropTable
DROP TABLE "GalleryItem";
