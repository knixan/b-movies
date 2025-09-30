-- AlterTable
ALTER TABLE "public"."Movie" ALTER COLUMN "releaseDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Person" ADD COLUMN     "profilePath" TEXT,
ALTER COLUMN "tmdbId" DROP NOT NULL;
