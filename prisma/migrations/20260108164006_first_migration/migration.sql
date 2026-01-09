-- CreateTable
CREATE TABLE "Secret" (
    "id" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "value" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Secret_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Secret_id_title_idx" ON "Secret"("id", "title");
