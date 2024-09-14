-- DropForeignKey
ALTER TABLE "rental_products" DROP CONSTRAINT "rental_products_productId_fkey";

-- AddForeignKey
ALTER TABLE "rental_products" ADD CONSTRAINT "rental_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
