-- DropForeignKey
ALTER TABLE "GalleryAlbum" DROP CONSTRAINT "GalleryAlbum_categoryId_fkey";

-- DropColumn
ALTER TABLE "GalleryAlbum" DROP COLUMN "categoryId";
