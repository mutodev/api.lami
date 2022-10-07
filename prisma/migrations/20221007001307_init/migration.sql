-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "sendToSap" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "sendToSap" DROP NOT NULL;
