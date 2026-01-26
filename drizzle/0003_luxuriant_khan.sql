CREATE TABLE `testimonials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int,
	`authorName` varchar(255) NOT NULL,
	`authorPhoto` text,
	`content` text NOT NULL,
	`rating` int NOT NULL,
	`isVerified` boolean NOT NULL DEFAULT false,
	`isFeatured` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);
