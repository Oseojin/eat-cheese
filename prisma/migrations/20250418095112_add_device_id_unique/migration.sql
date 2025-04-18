/*
  Warnings:

  - A unique constraint covering the columns `[deviceId]` on the table `Cheese` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `deviceId` to the `Cheese` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Cheese` ADD COLUMN `deviceId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Cheese_deviceId_key` ON `Cheese`(`deviceId`);
