-- CreateTable
CREATE TABLE "Slots" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "providerSlotId" TEXT NOT NULL,

    CONSTRAINT "Slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaxAvailability" (
    "id" SERIAL NOT NULL,
    "paxContentId" INTEGER,
    "paxPriceProfilesId" INTEGER,
    "slotsId" INTEGER NOT NULL,
    "max" INTEGER NOT NULL,
    "min" INTEGER NOT NULL,
    "remaining" INTEGER NOT NULL,
    "isPrimary" BOOLEAN,

    CONSTRAINT "PaxAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaxPriceProfiles" (
    "id" SERIAL NOT NULL,
    "finalPrice" DOUBLE PRECISION NOT NULL,
    "originalPrice" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,

    CONSTRAINT "PaxPriceProfiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaxContent" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PaxContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Slots_productId_providerSlotId_key" ON "Slots"("productId", "providerSlotId");

-- CreateIndex
CREATE UNIQUE INDEX "PaxPriceProfiles_finalPrice_originalPrice_key" ON "PaxPriceProfiles"("finalPrice", "originalPrice");

-- CreateIndex
CREATE UNIQUE INDEX "PaxContent_type_name_description_key" ON "PaxContent"("type", "name", "description");

-- AddForeignKey
ALTER TABLE "PaxAvailability" ADD CONSTRAINT "PaxAvailability_paxContentId_fkey" FOREIGN KEY ("paxContentId") REFERENCES "PaxContent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaxAvailability" ADD CONSTRAINT "PaxAvailability_paxPriceProfilesId_fkey" FOREIGN KEY ("paxPriceProfilesId") REFERENCES "PaxPriceProfiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaxAvailability" ADD CONSTRAINT "PaxAvailability_slotsId_fkey" FOREIGN KEY ("slotsId") REFERENCES "Slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
