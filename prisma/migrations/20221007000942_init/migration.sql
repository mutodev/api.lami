/*
  Warnings:

  - The values [NATURAL,JURIDICA] on the enum `EnumCustomerType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EnumCustomerType_new" AS ENUM ('PERSONA_NATURAL', 'PERSONA_JURIDICA');
ALTER TABLE "Customer" ALTER COLUMN "type" TYPE "EnumCustomerType_new" USING ("type"::text::"EnumCustomerType_new");
ALTER TYPE "EnumCustomerType" RENAME TO "EnumCustomerType_old";
ALTER TYPE "EnumCustomerType_new" RENAME TO "EnumCustomerType";
DROP TYPE "EnumCustomerType_old";
COMMIT;

-- DropIndex
DROP INDEX "Customer_phone_key";

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "messageError" TEXT DEFAULT '',
ADD COLUMN     "sendToSap" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "phone" DROP NOT NULL;
