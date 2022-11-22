/*
  Warnings:

  - You are about to drop the column `premium` on the `Guild` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `SecretSanta` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Enum("SecretSanta_status")`.

*/
-- AlterTable
ALTER TABLE `Guild` DROP COLUMN `premium`;

-- AlterTable
ALTER TABLE `SecretSanta` MODIFY `status` ENUM('SCHEDULED', 'ACTIVE', 'COMPLETED', 'CANCELLED') NOT NULL;
