/*
  Warnings:

  - You are about to drop the column `published` on the `File` table. All the data in the column will be lost.
  - Added the required column `size` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "published",
ADD COLUMN     "size" TEXT NOT NULL,
ADD COLUMN     "uploaded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "url" TEXT NOT NULL;
