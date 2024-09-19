/*
  Warnings:

  - You are about to drop the column `wayToGet` on the `rentals` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "rentals" DROP COLUMN "wayToGet",
ADD COLUMN     "isDelivery" BOOLEAN;
