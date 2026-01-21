/*
  Warnings:

  - You are about to drop the `Secret` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SecretFile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Secret";

-- DropTable
DROP TABLE "SecretFile";

-- CreateTable
CREATE TABLE "secret" (
    "id" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "value" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "secret_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" UUID NOT NULL,
    "filename" VARCHAR(100) NOT NULL,
    "url" VARCHAR(300) NOT NULL,
    "extension" VARCHAR(50) NOT NULL,
    "mimeType" VARCHAR(100) NOT NULL,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "secret_id_title_idx" ON "secret"("id", "title");

-- CreateIndex
CREATE INDEX "files_id_filename_url_extension_idx" ON "files"("id", "filename", "url", "extension");
