/*
  Warnings:

  - You are about to drop the column `clientId` on the `Bookings` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bedrooms` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `events` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `descript` to the `Role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleName` to the `Role` table without a default value. This is not possible if the table is not empty.
  - Made the column `roleId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Bookings" DROP CONSTRAINT "Bookings_clientId_fkey";

-- DropForeignKey
ALTER TABLE "BookingsDetails" DROP CONSTRAINT "BookingsDetails_bedroomsId_fkey";

-- DropForeignKey
ALTER TABLE "Invoce" DROP CONSTRAINT "Invoce_clientId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roleId_fkey";

-- DropForeignKey
ALTER TABLE "bedrooms" DROP CONSTRAINT "bedrooms_seasonsId_fkey";

-- AlterTable
ALTER TABLE "Bookings" DROP COLUMN "clientId";

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "name",
ADD COLUMN     "descript" TEXT NOT NULL,
ADD COLUMN     "roleName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ALTER COLUMN "roleId" SET NOT NULL;

-- DropTable
DROP TABLE "Client";

-- DropTable
DROP TABLE "bedrooms";

-- DropTable
DROP TABLE "comments";

-- DropTable
DROP TABLE "events";

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

-- CreateTable
CREATE TABLE "Bedrooms" (
    "id" SERIAL NOT NULL,
    "typeBedroom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "lowSeasonPrice" INTEGER NOT NULL,
    "highSeasonPrice" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,
    "numberBedroom" INTEGER NOT NULL,
    "seasonsId" INTEGER NOT NULL,

    CONSTRAINT "Bedrooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comments" (
    "id" SERIAL NOT NULL,
    "comment" TEXT NOT NULL,
    "boookingId" INTEGER NOT NULL,
    "comments" TEXT NOT NULL,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Events" (
    "id" SERIAL NOT NULL,
    "nameEvents" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "hours" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersRole" (
    "Id_user" INTEGER NOT NULL,
    "Id_role" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BookingsToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UsersRole_Id_user_key" ON "UsersRole"("Id_user");

-- CreateIndex
CREATE UNIQUE INDEX "_BookingsToUser_AB_unique" ON "_BookingsToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_BookingsToUser_B_index" ON "_BookingsToUser"("B");

-- AddForeignKey
ALTER TABLE "BookingsDetails" ADD CONSTRAINT "BookingsDetails_bedroomsId_fkey" FOREIGN KEY ("bedroomsId") REFERENCES "Bedrooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bedrooms" ADD CONSTRAINT "Bedrooms_seasonsId_fkey" FOREIGN KEY ("seasonsId") REFERENCES "Seasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookingsToUser" ADD CONSTRAINT "_BookingsToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookingsToUser" ADD CONSTRAINT "_BookingsToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
