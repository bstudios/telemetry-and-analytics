CREATE TABLE `adamrmsinstallations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`timestamp` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`rooturl` text NOT NULL,
	`version` text NOT NULL,
	`devmode` integer DEFAULT false NOT NULL,
	`hidden` integer DEFAULT false NOT NULL,
	`metadata` text DEFAULT [object Object]
);
