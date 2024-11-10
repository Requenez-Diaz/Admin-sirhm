/*
  Warnings:

  - You are about to drop the `Bookings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BookingsToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BookingsDetails" DROP CONSTRAINT "BookingsDetails_bookingsId_fkey";

-- DropForeignKey
ALTER TABLE "_BookingsToUser" DROP CONSTRAINT "_BookingsToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_BookingsToUser" DROP CONSTRAINT "_BookingsToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "bookingsServices" DROP CONSTRAINT "bookingsServices_bookingId_fkey";

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Bookings";

-- DropTable
DROP TABLE "_BookingsToUser";

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
