/*
  Warnings:

  - The primary key for the `Guild` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Guild` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(19)`.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(19)`.

*/
-- AlterTable
ALTER TABLE `Guild` DROP PRIMARY KEY,
    ADD COLUMN `secret_santa_blacklist` JSON NOT NULL,
    MODIFY `id` VARCHAR(19) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(19) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `SecretSanta` (
    `id` VARCHAR(19) NOT NULL,
    `guild_id` VARCHAR(19) NOT NULL,
    `status` INTEGER NOT NULL,
    `users` JSON NOT NULL,

    UNIQUE INDEX `SecretSanta_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SecretSanta` ADD CONSTRAINT `SecretSanta_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `Guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
