-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_categoryId_fkey";

-- DropTable
DROP TABLE "category";

-- DropTable
DROP TABLE "product";
