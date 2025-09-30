/*
  Warnings:

  - A unique constraint covering the columns `[movieId,personId,role,job,character]` on the table `MovieCrew` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."MovieCrew_movieId_personId_role_key";

-- AlterTable
ALTER TABLE "public"."Movie" ALTER COLUMN "budget" SET DATA TYPE BIGINT,
ALTER COLUMN "revenue" SET DATA TYPE BIGINT,
ALTER COLUMN "tmdbId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "public"."Person" ALTER COLUMN "tmdbId" SET DATA TYPE BIGINT;

-- CreateIndex
CREATE UNIQUE INDEX "MovieCrew_movieId_personId_role_job_character_key" ON "public"."MovieCrew"("movieId", "personId", "role", "job", "character");
