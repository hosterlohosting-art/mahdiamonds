CREATE INDEX `idx_appointments_status_starts` ON `appointments` (`status`,`starts_at`);--> statement-breakpoint
CREATE INDEX `idx_articles_status_published` ON `articles` (`status`,`published_at`);--> statement-breakpoint
CREATE INDEX `idx_enquiries_status_created` ON `enquiries` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_orders_status_created` ON `orders` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_orders_customer_email` ON `orders` (`customer_email`);--> statement-breakpoint
CREATE INDEX `idx_products_category_status` ON `products` (`category`,`status`);--> statement-breakpoint
PRAGMA optimize;
