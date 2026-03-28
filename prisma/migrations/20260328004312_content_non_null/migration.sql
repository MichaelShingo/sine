/*
  Warnings:

  - Made the column `content` on table `Contract` required. This step will fail if there are existing NULL values in that column.
  - Made the column `content` on table `Template` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Contract" ALTER COLUMN "content" SET NOT NULL;

-- AlterTable
ALTER TABLE "Template" ALTER COLUMN "content" SET NOT NULL;
