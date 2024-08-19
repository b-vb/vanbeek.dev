/*
  Warnings:

  - You are about to alter the column `weight` on the `Measurement` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the column `start_weight` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Measurement" ALTER COLUMN "weight" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "start_weight",
ADD COLUMN     "goal_date" TIMESTAMP(3) NOT NULL DEFAULT '1970-01-01 00:00:00 +00:00',
ADD COLUMN     "goal_weight" INTEGER NOT NULL DEFAULT 0;
