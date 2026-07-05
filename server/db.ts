import { eq, and, desc, asc, gte, lte, sql, count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, properties, propertyImages, propertyViews, adminStats, InsertProperty, InsertPropertyImage, Property } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "phoneNumber"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Generate reference number (RB-001, RB-002, etc.)
 */
export async function generateReferenceNumber() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select({ count: count() }).from(properties);
  const nextNumber = (result[0]?.count || 0) + 1;
  return `RB-${String(nextNumber).padStart(3, '0')}`;
}

/**
 * Properties queries
 */
export async function createProperty(data: InsertProperty) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Generate reference number if not provided
  if (!data.referenceNumber) {
    data.referenceNumber = await generateReferenceNumber();
  }
  
  const result = await db.insert(properties).values(data);
  return result[0];
}

export async function getPropertyById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(properties).where(eq(properties.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getPropertiesByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(properties).where(eq(properties.userId, userId)).orderBy(desc(properties.createdAt));
}

export async function getActiveProperties(filters?: {
  type?: string;
  operationType?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
}) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [eq(properties.isActive, true)];
  
  if (filters?.type) conditions.push(eq(properties.type, filters.type as any));
  if (filters?.operationType) conditions.push(eq(properties.operationType, filters.operationType as any));
  if (filters?.location) conditions.push(sql`${properties.location} LIKE ${`%${filters.location}%`}`);
  if (filters?.minPrice) conditions.push(gte(properties.price, filters.minPrice.toString()));
  if (filters?.maxPrice) conditions.push(lte(properties.price, filters.maxPrice.toString()));
  if (filters?.minArea && properties.area) conditions.push(gte(properties.area, filters.minArea));
  if (filters?.maxArea && properties.area) conditions.push(lte(properties.area, filters.maxArea));
  
  return db.select().from(properties).where(and(...conditions)).orderBy(desc(properties.createdAt));
}

export async function updateProperty(id: number, data: Partial<Property>) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.update(properties).set(data).where(eq(properties.id, id));
  return result[0];
}

export async function deleteProperty(id: number) {
  const db = await getDb();
  if (!db) return false;
  
  await db.delete(properties).where(eq(properties.id, id));
  return true;
}

/**
 * Property images queries
 */
export async function addPropertyImage(data: InsertPropertyImage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(propertyImages).values(data);
  return result[0];
}

export async function getPropertyImages(propertyId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(propertyImages).where(eq(propertyImages.propertyId, propertyId)).orderBy(asc(propertyImages.order));
}

export async function deletePropertyImage(id: number) {
  const db = await getDb();
  if (!db) return false;
  
  await db.delete(propertyImages).where(eq(propertyImages.id, id));
  return true;
}

/**
 * Property views tracking
 */
export async function trackPropertyView(propertyId: number) {
  const db = await getDb();
  if (!db) return false;
  
  await db.insert(propertyViews).values({ propertyId });
  return true;
}

export async function getPropertyViewCount(propertyId: number) {
  const db = await getDb();
  if (!db) return 0;
  
  const result = await db.select({ count: count() }).from(propertyViews).where(eq(propertyViews.propertyId, propertyId));
  return result[0]?.count || 0;
}

/**
 * Admin statistics
 */
export async function getAdminStats() {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(adminStats).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateAdminStats() {
  const db = await getDb();
  if (!db) return false;
  
  const totalUsersResult = await db.select({ count: count() }).from(users);
  const totalPropertiesResult = await db.select({ count: count() }).from(properties);
  const totalViewsResult = await db.select({ count: count() }).from(propertyViews);
  const rentListingsResult = await db.select({ count: count() }).from(properties).where(eq(properties.operationType, 'rent'));
  const saleListingsResult = await db.select({ count: count() }).from(properties).where(eq(properties.operationType, 'sale'));
  
  const stats = {
    totalUsers: totalUsersResult[0]?.count || 0,
    totalProperties: totalPropertiesResult[0]?.count || 0,
    totalViews: totalViewsResult[0]?.count || 0,
    totalRentListings: rentListingsResult[0]?.count || 0,
    totalSaleListings: saleListingsResult[0]?.count || 0,
  };
  
  const existing = await getAdminStats();
  if (existing) {
    await db.update(adminStats).set(stats).where(eq(adminStats.id, existing.id));
  } else {
    await db.insert(adminStats).values(stats as any);
  }
  
  return true;
}
