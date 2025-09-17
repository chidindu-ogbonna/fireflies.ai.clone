/*
  Warnings:

  - A unique constraint covering the columns `[userId,key]` on the table `DeepgramKey` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `DeepgramKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."DeepgramKey" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DeepgramKey_userId_key_key" ON "public"."DeepgramKey"("userId", "key");

-- AddForeignKey
ALTER TABLE "public"."DeepgramKey" ADD CONSTRAINT "DeepgramKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
