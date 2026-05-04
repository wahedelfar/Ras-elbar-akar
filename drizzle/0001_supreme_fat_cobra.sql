CREATE TABLE `adminStats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`totalUsers` int DEFAULT 0,
	`totalProperties` int DEFAULT 0,
	`totalViews` int DEFAULT 0,
	`totalRentListings` int DEFAULT 0,
	`totalSaleListings` int DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `adminStats_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `properties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`type` enum('apartment','villa','house','land','commercial','other') NOT NULL,
	`operationType` enum('sale','rent') NOT NULL,
	`price` decimal(12,2) NOT NULL,
	`area` int,
	`location` varchar(255) NOT NULL,
	`phoneNumber` varchar(20) NOT NULL,
	`whatsappNumber` varchar(20),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `properties_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `propertyImages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`propertyId` int NOT NULL,
	`imageUrl` text NOT NULL,
	`imageKey` varchar(255) NOT NULL,
	`order` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `propertyImages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `propertyViews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`propertyId` int NOT NULL,
	`viewedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `propertyViews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `phoneNumber` varchar(20);--> statement-breakpoint
ALTER TABLE `properties` ADD CONSTRAINT `properties_userId_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `propertyImages` ADD CONSTRAINT `propertyImages_propertyId_fk` FOREIGN KEY (`propertyId`) REFERENCES `properties`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `propertyViews` ADD CONSTRAINT `propertyViews_propertyId_fk` FOREIGN KEY (`propertyId`) REFERENCES `properties`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `userId_idx` ON `properties` (`userId`);--> statement-breakpoint
CREATE INDEX `type_idx` ON `properties` (`type`);--> statement-breakpoint
CREATE INDEX `operationType_idx` ON `properties` (`operationType`);--> statement-breakpoint
CREATE INDEX `location_idx` ON `properties` (`location`);--> statement-breakpoint
CREATE INDEX `isActive_idx` ON `properties` (`isActive`);--> statement-breakpoint
CREATE INDEX `propertyId_idx` ON `propertyImages` (`propertyId`);--> statement-breakpoint
CREATE INDEX `propertyId_idx` ON `propertyViews` (`propertyId`);