-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "messageError" TEXT DEFAULT '',
ADD COLUMN     "sendToSap" BOOLEAN NOT NULL DEFAULT false;
