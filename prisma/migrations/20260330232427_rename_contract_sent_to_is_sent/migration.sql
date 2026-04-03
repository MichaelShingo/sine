/*
  Warnings:

  - You are about to drop the column `sent` on the `Contract` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "sent",
ADD COLUMN     "isSent" BOOLEAN NOT NULL DEFAULT false;
