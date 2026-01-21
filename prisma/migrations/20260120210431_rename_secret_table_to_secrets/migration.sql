/*
  Warnings:

  - You are about to drop the `secret` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "secret";

-- CreateTable
CREATE TABLE "secrets" (
    "id" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "value" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "secrets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "secrets_id_title_idx" ON "secrets"("id", "title");
