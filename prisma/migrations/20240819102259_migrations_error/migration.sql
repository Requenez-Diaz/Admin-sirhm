/*
  Warnings:

  - You are about to drop the column `roleId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[roleName]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roleName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "roleId",
ADD COLUMN     "roleName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Role_roleName_key" ON "Role"("roleName");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleName_fkey" FOREIGN KEY ("roleName") REFERENCES "Role"("roleName") ON DELETE RESTRICT ON UPDATE CASCADE;
