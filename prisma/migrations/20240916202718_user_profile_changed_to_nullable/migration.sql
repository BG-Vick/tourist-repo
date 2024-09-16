/*
  Warnings:

  - You are about to drop the column `lsatName` on the `profiles` table. All the data in the column will be lost.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(25)`.

*/
-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "lsatName",
ADD COLUMN     "lastName" TEXT,
ALTER COLUMN "adress" DROP NOT NULL,
ALTER COLUMN "comment" DROP NOT NULL,
ALTER COLUMN "firstName" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE VARCHAR(25);
