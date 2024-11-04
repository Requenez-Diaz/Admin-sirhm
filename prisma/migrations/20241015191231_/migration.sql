/*
  Warnings:

  - Added the required column `capacity` to the `Bedrooms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bedrooms" ADD COLUMN     "amenities" TEXT[],
ADD COLUMN     "capacity" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Reservation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "bedroomsType" TEXT NOT NULL,
    "guests" INTEGER NOT NULL,
    "rooms" INTEGER NOT NULL,
    "arrivalDate" TIMESTAMP(3) NOT NULL,
    "departureDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);
