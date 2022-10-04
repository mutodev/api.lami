-- CreateEnum
CREATE TYPE "EnumRoles" AS ENUM ('SUPERADMINISTRADOR', 'LIDER_COMERCIAL', 'VENDEDOR', 'CAJA', 'COORDINADOR_DE_LOGISTICA', 'CONDUCTOR');

-- CreateEnum
CREATE TYPE "EnumCustomerType" AS ENUM ('NATURAL', 'JURIDICA');

-- CreateTable
CREATE TABLE "Menu" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "subtitle" VARCHAR(100) NOT NULL,
    "button" JSON NOT NULL,
    "type" VARCHAR(100),
    "hidden" BOOLEAN,
    "active" BOOLEAN DEFAULT true,
    "disabled" BOOLEAN DEFAULT false,
    "tooltip" TEXT,
    "link" TEXT,
    "fragment" TEXT,
    "preserveFragment" BOOLEAN,
    "queryParams" JSONB NOT NULL,
    "classes" JSONB NOT NULL,
    "icon" TEXT,
    "badge" JSONB NOT NULL,
    "meta" JSONB NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenoRole" (
    "id" TEXT NOT NULL,
    "menuId" VARCHAR(255) NOT NULL,
    "role" "EnumRoles" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenoRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "userName" VARCHAR(100) NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100),
    "phone" VARCHAR(15),
    "photo" TEXT,
    "role" "EnumRoles" NOT NULL,
    "active" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "type" "EnumCustomerType" NOT NULL,
    "identificationType" VARCHAR(100) NOT NULL,
    "identification" VARCHAR(20) NOT NULL,
    "source" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100),
    "address" VARCHAR(255),
    "phone" VARCHAR(30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "customerId" VARCHAR(100) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "vatTotal" DOUBLE PRECISION NOT NULL,
    "subTotal" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderDetail" (
    "id" TEXT NOT NULL,
    "orderId" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "aditionalInfo" TEXT NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "amount" INTEGER NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "vat" DOUBLE PRECISION NOT NULL,
    "project" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Integration" (
    "id" TEXT NOT NULL,
    "module" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Integration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntegrationDetail" (
    "id" TEXT NOT NULL,
    "fieldApp" VARCHAR(255) NOT NULL,
    "fieldIntegration" VARCHAR(255) NOT NULL,
    "integrationId" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntegrationDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Menu_title_key" ON "Menu"("title");

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_identification_key" ON "Customer"("identification");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phone_key" ON "Customer"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Integration_module_key" ON "Integration"("module");

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Menu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenoRole" ADD CONSTRAINT "MenoRole_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetail" ADD CONSTRAINT "OrderDetail_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntegrationDetail" ADD CONSTRAINT "IntegrationDetail_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
