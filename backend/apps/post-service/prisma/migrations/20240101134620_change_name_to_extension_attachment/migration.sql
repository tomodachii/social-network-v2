/*
  Warnings:

  - You are about to drop the column `name` on the `attachment` table. All the data in the column will be lost.
  - Added the required column `extension` to the `attachment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `attachment` DROP COLUMN `name`,
    ADD COLUMN `extension` VARCHAR(191) NOT NULL;
