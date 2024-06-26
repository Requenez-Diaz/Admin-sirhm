/*
  Warnings:

  - The primary key for the `bookingsServices` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `bookingsDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `client` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `invoce` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `seasons` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `services` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `clientId` on the `Bookings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `seasonsId` to the `bedrooms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bookings" DROP COLUMN "clientId",
ADD COLUMN     "clientId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "bedrooms" ADD COLUMN     "seasonsId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "bookingsServices" DROP CONSTRAINT "bookingsServices_pkey",
ADD COLUMN     "servicesId" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "bookingsServices_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "bookingsServices_id_seq";

-- DropTable
DROP TABLE "bookingsDetails";

-- DropTable
DROP TABLE "client";

-- DropTable
DROP TABLE "invoce";

-- DropTable
DROP TABLE "seasons";

-- DropTable
DROP TABLE "services";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" INTEGER NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Services" (
    "id" TEXT NOT NULL,
    "nameService" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "Services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seasons" (
    "id" SERIAL NOT NULL,
    "nameSeason" TEXT NOT NULL,
    "dateStart" TIMESTAMP(3) NOT NULL,
    "dateEnd" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingsDetails" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "bedroomId" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "dateStart" TIMESTAMP(3) NOT NULL,
    "dateEnd" TIMESTAMP(3) NOT NULL,
    "promotionId" INTEGER NOT NULL,
    "status" "Status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bookingsId" INTEGER NOT NULL,
    "bedroomsId" INTEGER NOT NULL,
    "promotionsId" INTEGER NOT NULL,

    CONSTRAINT "BookingsDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoce" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoce_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- AddForeignKey
ALTER TABLE "bedrooms" ADD CONSTRAINT "bedrooms_seasonsId_fkey" FOREIGN KEY ("seasonsId") REFERENCES "Seasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookingsServices" ADD CONSTRAINT "bookingsServices_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookingsServices" ADD CONSTRAINT "bookingsServices_servicesId_fkey" FOREIGN KEY ("servicesId") REFERENCES "Services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingsDetails" ADD CONSTRAINT "BookingsDetails_bookingsId_fkey" FOREIGN KEY ("bookingsId") REFERENCES "Bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingsDetails" ADD CONSTRAINT "BookingsDetails_bedroomsId_fkey" FOREIGN KEY ("bedroomsId") REFERENCES "bedrooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingsDetails" ADD CONSTRAINT "BookingsDetails_promotionsId_fkey" FOREIGN KEY ("promotionsId") REFERENCES "promotions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoce" ADD CONSTRAINT "Invoce_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoceDetails" ADD CONSTRAINT "invoceDetails_invoceId_fkey" FOREIGN KEY ("invoceId") REFERENCES "Invoce"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
