/*
  Warnings:

  - You are about to drop the `Bedroom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Booking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BookingDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BookingService` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HistoricReservation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Invoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InvoiceDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Promotion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Season` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Testimonial` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Bedroom" DROP CONSTRAINT "Bedroom_seasonId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_clientId_fkey";

-- DropForeignKey
ALTER TABLE "BookingDetail" DROP CONSTRAINT "BookingDetail_bedroomId_fkey";

-- DropForeignKey
ALTER TABLE "BookingDetail" DROP CONSTRAINT "BookingDetail_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "BookingDetail" DROP CONSTRAINT "BookingDetail_promotionId_fkey";

-- DropForeignKey
ALTER TABLE "BookingService" DROP CONSTRAINT "BookingService_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "BookingService" DROP CONSTRAINT "BookingService_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "HistoricReservation" DROP CONSTRAINT "HistoricReservation_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_clientId_fkey";

-- DropForeignKey
ALTER TABLE "InvoiceDetail" DROP CONSTRAINT "InvoiceDetail_invoiceId_fkey";

-- DropTable
DROP TABLE "Bedroom";

-- DropTable
DROP TABLE "Booking";

-- DropTable
DROP TABLE "BookingDetail";

-- DropTable
DROP TABLE "BookingService";

-- DropTable
DROP TABLE "Client";

-- DropTable
DROP TABLE "Comment";

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "HistoricReservation";

-- DropTable
DROP TABLE "Invoice";

-- DropTable
DROP TABLE "InvoiceDetail";

-- DropTable
DROP TABLE "Promotion";

-- DropTable
DROP TABLE "Season";

-- DropTable
DROP TABLE "Service";

-- DropTable
DROP TABLE "Testimonial";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "BookingStatus";

-- DropEnum
DROP TYPE "EventStatus";

-- DropEnum
DROP TYPE "Status";
