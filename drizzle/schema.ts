import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal, index, foreignKey } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  phoneNumber: varchar("phoneNumber", { length: 20 }),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Admin statistics (cached for performance)
 */
export const adminStats = mysqlTable("adminStats", {
  id: int("id").autoincrement().primaryKey(),
  totalUsers: int("totalUsers").default(0),
  totalProperties: int("totalProperties").default(0),
  totalViews: int("totalViews").default(0),
  totalRentListings: int("totalRentListings").default(0),
  totalSaleListings: int("totalSaleListings").default(0),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AdminStats = typeof adminStats.$inferSelect;
export type InsertAdminStats = typeof adminStats.$inferInsert;

/**
 * Properties table for real estate listings
 */
export const properties = mysqlTable(
  "properties",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    type: mysqlEnum("type", ["apartment", "villa", "house", "land", "commercial", "other"]).notNull(),
    operationType: mysqlEnum("operationType", ["sale", "rent"]).notNull(),
    price: decimal("price", { precision: 12, scale: 2 }).notNull(),
    area: int("area"), // in square meters
    location: varchar("location", { length: 255 }).notNull(),
    phoneNumber: varchar("phoneNumber", { length: 20 }).notNull(),
    whatsappNumber: varchar("whatsappNumber", { length: 20 }),
    isActive: boolean("isActive").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("userId_idx").on(table.userId),
    typeIdx: index("type_idx").on(table.type),
    operationTypeIdx: index("operationType_idx").on(table.operationType),
    locationIdx: index("location_idx").on(table.location),
    isActiveIdx: index("isActive_idx").on(table.isActive),
    userIdFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "properties_userId_fk",
    }).onDelete("cascade"),
  })
);

export type Property = typeof properties.$inferSelect;
export type InsertProperty = typeof properties.$inferInsert;

/**
 * Property images table
 */
export const propertyImages = mysqlTable(
  "propertyImages",
  {
    id: int("id").autoincrement().primaryKey(),
    propertyId: int("propertyId").notNull(),
    imageUrl: text("imageUrl").notNull(),
    imageKey: varchar("imageKey", { length: 255 }).notNull(),
    order: int("order").default(0),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    propertyIdIdx: index("propertyId_idx").on(table.propertyId),
    propertyIdFk: foreignKey({
      columns: [table.propertyId],
      foreignColumns: [properties.id],
      name: "propertyImages_propertyId_fk",
    }).onDelete("cascade"),
  })
);

export type PropertyImage = typeof propertyImages.$inferSelect;
export type InsertPropertyImage = typeof propertyImages.$inferInsert;

/**
 * Property views tracking
 */
export const propertyViews = mysqlTable(
  "propertyViews",
  {
    id: int("id").autoincrement().primaryKey(),
    propertyId: int("propertyId").notNull(),
    viewedAt: timestamp("viewedAt").defaultNow().notNull(),
  },
  (table) => ({
    propertyIdIdx: index("propertyId_idx").on(table.propertyId),
    propertyIdFk: foreignKey({
      columns: [table.propertyId],
      foreignColumns: [properties.id],
      name: "propertyViews_propertyId_fk",
    }).onDelete("cascade"),
  })
);

export type PropertyView = typeof propertyViews.$inferSelect;
export type InsertPropertyView = typeof propertyViews.$inferInsert;