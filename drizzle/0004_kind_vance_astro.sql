CREATE TABLE `adminLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`adminId` int NOT NULL,
	`action` varchar(100) NOT NULL,
	`targetType` varchar(50) NOT NULL,
	`targetId` int,
	`details` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `adminLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`paymentType` enum('vip','featured','verification','monthly') NOT NULL,
	`paymentMethod` varchar(50) NOT NULL DEFAULT 'pix',
	`pixKey` text,
	`transactionId` varchar(255),
	`status` enum('pending','confirmed','cancelled') NOT NULL DEFAULT 'pending',
	`paidAt` timestamp,
	`confirmedBy` int,
	`notes` text,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `profiles` MODIFY COLUMN `isActive` boolean NOT NULL DEFAULT false;--> statement-breakpoint
ALTER TABLE `profiles` ADD `isApproved` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `profiles` ADD `approvalStatus` enum('pending','approved','rejected') DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `profiles` ADD `rejectionReason` text;