ALTER TABLE `properties` ADD `referenceNumber` varchar(20);--> statement-breakpoint
ALTER TABLE `properties` ADD CONSTRAINT `properties_referenceNumber_unique` UNIQUE(`referenceNumber`);