/*
  Warnings:

  - You are about to drop the column `description` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `imageURL` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the `Actor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Director` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ActorToMovie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DirectorToMovie` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[tmdbId]` on the table `Movie` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."_ActorToMovie" DROP CONSTRAINT "_ActorToMovie_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ActorToMovie" DROP CONSTRAINT "_ActorToMovie_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_DirectorToMovie" DROP CONSTRAINT "_DirectorToMovie_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_DirectorToMovie" DROP CONSTRAINT "_DirectorToMovie_B_fkey";

-- AlterTable
ALTER TABLE "public"."Movie" DROP COLUMN "description",
DROP COLUMN "imageURL",
ADD COLUMN     "backdropPath" TEXT,
ADD COLUMN     "overview" TEXT,
ADD COLUMN     "posterPath" TEXT,
ADD COLUMN     "tagline" TEXT,
ADD COLUMN     "tmdbId" INTEGER;

-- DropTable
DROP TABLE "public"."Actor";

-- DropTable
DROP TABLE "public"."Director";

-- DropTable
DROP TABLE "public"."_ActorToMovie";

-- DropTable
DROP TABLE "public"."_DirectorToMovie";

-- CreateTable
CREATE TABLE "public"."Person" (
    "id" SERIAL NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "birthday" TIMESTAMP(3),
    "biography" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MovieCrew" (
    "id" SERIAL NOT NULL,
    "movieId" INTEGER NOT NULL,
    "personId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "character" TEXT,
    "order" INTEGER,

    CONSTRAINT "MovieCrew_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_tmdbId_key" ON "public"."Person"("tmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "MovieCrew_movieId_personId_role_key" ON "public"."MovieCrew"("movieId", "personId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "Movie_tmdbId_key" ON "public"."Movie"("tmdbId");

-- AddForeignKey
ALTER TABLE "public"."MovieCrew" ADD CONSTRAINT "MovieCrew_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "public"."Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MovieCrew" ADD CONSTRAINT "MovieCrew_personId_fkey" FOREIGN KEY ("personId") REFERENCES "public"."Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
