/*
  Warnings:

  - Changed the type of `role` on the `MovieCrew` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('CREW', 'CAST');

-- AlterTable
ALTER TABLE "public"."MovieCrew" DROP COLUMN "role",
ADD COLUMN     "role" "public"."Role" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MovieCrew_movieId_personId_role_job_character_key" ON "public"."MovieCrew"("movieId", "personId", "role", "job", "character");
