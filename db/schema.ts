import { index, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  sku: text("sku").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  style: text("style").notNull(),
  metal: text("metal").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  stock: integer("stock").notNull().default(0),
  status: text("status").notNull().default("draft"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  imageKey: text("image_key"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
}, (table) => [
  index("idx_products_category_status").on(table.category, table.status),
]);

export const diamondInventory = sqliteTable("diamond_inventory", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  shape: text("shape").notNull(),
  carat: real("carat").notNull(),
  colour: text("colour").notNull(),
  clarity: text("clarity").notNull(),
  cut: text("cut").notNull(),
  price: real("price").notNull(),
  status: text("status").notNull().default("available"),
  certificateReference: text("certificate_reference"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name").notNull(),
  status: text("status").notNull().default("new"),
  currency: text("currency").notNull().default("GBP"),
  subtotal: real("subtotal").notNull(),
  total: real("total").notNull(),
  paymentReference: text("payment_reference"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
}, (table) => [
  index("idx_orders_status_created").on(table.status, table.createdAt),
  index("idx_orders_customer_email").on(table.customerEmail),
]);

export const orderItems = sqliteTable("order_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: text("order_id").notNull().references(() => orders.id),
  itemReference: text("item_reference").notNull(),
  name: text("name").notNull(),
  detail: text("detail").notNull(),
  quantity: integer("quantity").notNull().default(1),
  unitPrice: real("unit_price").notNull(),
});

export const enquiries = sqliteTable("enquiries", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
}, (table) => [
  index("idx_enquiries_status_created").on(table.status, table.createdAt),
]);

export const appointments = sqliteTable("appointments", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  consultationType: text("consultation_type").notNull(),
  subject: text("subject").notNull(),
  startsAt: integer("starts_at", { mode: "timestamp" }).notNull(),
  status: text("status").notNull().default("requested"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
}, (table) => [
  index("idx_appointments_status_starts").on(table.status, table.startsAt),
]);

export const articles = sqliteTable("articles", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body").notNull(),
  status: text("status").notNull().default("draft"),
  publishedAt: integer("published_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
}, (table) => [
  index("idx_articles_status_published").on(table.status, table.publishedAt),
]);

export const siteSettings = sqliteTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});
