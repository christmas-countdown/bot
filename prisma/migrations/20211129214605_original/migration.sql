-- CreateTable
CREATE TABLE `Guild` (
    `id` VARCHAR(191) NOT NULL,
    `webhook` VARCHAR(191) NULL,
    `premium` BOOLEAN NOT NULL DEFAULT false,
    `last_sent` DATETIME(3) NULL,
    `locale` VARCHAR(191) NOT NULL DEFAULT 'en-GB',
    `timezone` VARCHAR(191) NOT NULL DEFAULT 'UTC',
    `enabled` BOOLEAN NOT NULL DEFAULT false,
    `auto_toggle` BOOLEAN NOT NULL DEFAULT false,
    `mention` VARCHAR(191) NULL,

    UNIQUE INDEX `Guild_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `locale` VARCHAR(191) NULL,
    `timezone` VARCHAR(191) NULL,

    UNIQUE INDEX `User_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
