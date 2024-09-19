/*
  Warnings:

  - The `offering_type` column on the `Offering` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "OfferingType" AS ENUM ('SUNDAY_SERVICE', 'SPECIAL_EVENT', 'INDIVIDUAL_DONATION');

-- AlterTable
ALTER TABLE "Offering" DROP COLUMN "offering_type",
ADD COLUMN     "offering_type" "OfferingType" NOT NULL DEFAULT 'SUNDAY_SERVICE';
