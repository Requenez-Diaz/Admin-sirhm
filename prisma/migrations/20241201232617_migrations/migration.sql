/*
  Warnings:

  - Added the required column `capacity` to the `Bedrooms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `table` to the `Bedrooms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bedrooms" ADD COLUMN     "amenities" TEXT[],
ADD COLUMN     "capacity" INTEGER NOT NULL,
ADD COLUMN     "table" TEXT NOT NULL;
