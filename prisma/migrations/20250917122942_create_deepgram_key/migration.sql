-- CreateTable
CREATE TABLE "public"."DeepgramKey" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeepgramKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeepgramKey_externalId_key" ON "public"."DeepgramKey"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "DeepgramKey_key_key" ON "public"."DeepgramKey"("key");
