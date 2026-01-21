-- CreateTable
CREATE TABLE "SecretFile" (
    "id" UUID NOT NULL,
    "filename" VARCHAR(100) NOT NULL,
    "url" VARCHAR(300) NOT NULL,
    "extension" VARCHAR(50) NOT NULL,
    "mimeType" VARCHAR(100) NOT NULL,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SecretFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SecretFile_id_filename_url_extension_idx" ON "SecretFile"("id", "filename", "url", "extension");
