import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure, adminProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { storagePut } from "./storage";
import { eq, desc } from "drizzle-orm";
import { users, properties, propertyImages } from "../drizzle/schema";

// Re-export for use in routers


export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    updateProfile: protectedProcedure
      .input(z.object({
        name: z.string().optional(),
        phoneNumber: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new Error("Not authenticated");
        
        const dbInstance = await db.getDb();
        if (!dbInstance) throw new Error("Database not available");
        
        await dbInstance.update(users).set({
          name: input.name,
          phoneNumber: input.phoneNumber,
        }).where(eq(users.id, ctx.user.id));
        
        return { success: true };
      }),
  }),

  properties: router({
    // List all active properties with filters
    list: publicProcedure
      .input(z.object({
        type: z.string().optional(),
        operationType: z.string().optional(),
        location: z.string().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        minArea: z.number().optional(),
        maxArea: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        const propertyList = await db.getActiveProperties(input);
        const propertiesWithImages = await Promise.all(
          propertyList.map(async (property) => {
            const images = await db.getPropertyImages(property.id);
            return { ...property, images };
          })
        );
        return propertiesWithImages;
      }),

    // Get property details
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const property = await db.getPropertyById(input);
        if (!property) return null;

        // Track view
        await db.trackPropertyView(input);

        // Get images
        const images = await db.getPropertyImages(input);
        const viewCount = await db.getPropertyViewCount(input);

        return {
          ...property,
          images,
          viewCount,
        };
      }),

    // Get user's properties
    myProperties: protectedProcedure
      .query(async ({ ctx }) => {
        if (!ctx.user) throw new Error("Not authenticated");
        return db.getPropertiesByUserId(ctx.user.id);
      }),

    // Create new property
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        type: z.enum(["apartment", "villa", "house", "land", "commercial", "other"]),
        operationType: z.enum(["sale", "rent"]),
        price: z.number(),
        area: z.number().optional(),
        location: z.string(),
        phoneNumber: z.string(),
        whatsappNumber: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new Error("Not authenticated");

        const property = await db.createProperty({
          userId: ctx.user.id,
          title: input.title,
          description: input.description || null,
          type: input.type,
          operationType: input.operationType,
          price: input.price.toString(),
          area: input.area || null,
          location: input.location,
          phoneNumber: input.phoneNumber,
          whatsappNumber: input.whatsappNumber || null,
        });

        return property;
      }),

    // Update property
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        type: z.enum(["apartment", "villa", "house", "land", "commercial", "other"]).optional(),
        operationType: z.enum(["sale", "rent"]).optional(),
        price: z.number().optional(),
        area: z.number().optional(),
        location: z.string().optional(),
        phoneNumber: z.string().optional(),
        whatsappNumber: z.string().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new Error("Not authenticated");

        const property = await db.getPropertyById(input.id);
        if (!property || property.userId !== ctx.user.id) {
          throw new Error("Not authorized");
        }

        const { id, ...data } = input;
        const updateData: any = {};
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined) {
            if (key === 'price' && typeof value === 'number') {
              updateData[key] = value.toString();
            } else {
              updateData[key] = value;
            }
          }
        });
        
        await db.updateProperty(id, updateData);

        return { success: true };
      }),

    // Delete property
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new Error("Not authenticated");

        const property = await db.getPropertyById(input);
        if (!property || property.userId !== ctx.user.id) {
          throw new Error("Not authorized");
        }

        await db.deleteProperty(input);
        return { success: true };
      }),

    // Toggle property active status
    toggleActive: protectedProcedure
      .input(z.number())
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new Error("Not authenticated");

        const property = await db.getPropertyById(input);
        if (!property || property.userId !== ctx.user.id) {
          throw new Error("Not authorized");
        }

        await db.updateProperty(input, { isActive: !property.isActive });
        return { success: true };
      }),
  }),

  propertyImages: router({
    // Get images for a property
    getByPropertyId: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getPropertyImages(input);
      }),

    // Add external image URL
    addExternalUrl: protectedProcedure
      .input(z.object({
        propertyId: z.number(),
        imageUrl: z.string().url(),
        order: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new Error("Not authenticated");

        const property = await db.getPropertyById(input.propertyId);
        if (!property || property.userId !== ctx.user.id) {
          throw new Error("Not authorized");
        }

        // Save external URL with empty imageKey
        const image = await db.addPropertyImage({
          propertyId: input.propertyId,
          imageUrl: input.imageUrl,
          imageKey: "",
          order: input.order || 0,
        });

        return image;
      }),

    // Upload image for property
    upload: protectedProcedure
      .input(z.object({
        propertyId: z.number(),
        imageBase64: z.string(),
        mimeType: z.string(),
        order: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new Error("Not authenticated");

        const property = await db.getPropertyById(input.propertyId);
        if (!property || property.userId !== ctx.user.id) {
          throw new Error("Not authorized");
        }

        // Decode base64 to buffer
        const buffer = Buffer.from(input.imageBase64, 'base64');
        
        // Upload to storage
        const fileKey = `properties/${input.propertyId}/${Date.now()}.jpg`;
        const { url, key } = await storagePut(fileKey, buffer, input.mimeType);

        // Save to database
        const image = await db.addPropertyImage({
          propertyId: input.propertyId,
          imageUrl: url,
          imageKey: key,
          order: input.order || 0,
        });

        return image;
      }),

    // Delete image
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) throw new Error("Not authenticated");

        // Get image to verify ownership
        const dbInstance = await db.getDb();
        if (!dbInstance) throw new Error("Database not available");
        
        const imageResult = await dbInstance.select().from(propertyImages).where(eq(propertyImages.id, input)).limit(1);

        if (!imageResult || imageResult.length === 0) {
          throw new Error("Image not found");
        }

        const image = imageResult[0];
        const property = await db.getPropertyById(image.propertyId);
        if (!property || property.userId !== ctx.user.id) {
          throw new Error("Not authorized");
        }

        await db.deletePropertyImage(input);
        return { success: true };
      }),
  }),

  admin: router({
    // Get all properties (admin only)
    allProperties: adminProcedure
      .query(async () => {
        const dbInstance = await db.getDb();
        if (!dbInstance) return [];
        return dbInstance.select().from(properties).orderBy(desc(properties.createdAt));
      }),

    // Get all users (admin only)
    allUsers: adminProcedure
      .query(async () => {
        const dbInstance = await db.getDb();
        if (!dbInstance) return [];
        return dbInstance.select().from(users);
      }),

    // Update user role (admin only)
    updateUserRole: adminProcedure
      .input(z.object({
        userId: z.number(),
        role: z.enum(["user", "admin"]),
      }))
      .mutation(async ({ input }) => {
        const dbInstance = await db.getDb();
        if (!dbInstance) throw new Error("Database not available");

        await dbInstance.update(users).set({ role: input.role }).where(eq(users.id, input.userId));
        return { success: true };
      }),

    // Delete user (admin only)
    deleteUser: adminProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        const dbInstance = await db.getDb();
        if (!dbInstance) throw new Error("Database not available");

        await dbInstance.delete(users).where(eq(users.id, input));
        return { success: true };
      }),

    // Deactivate property (admin only)
    deactivateProperty: adminProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        await db.updateProperty(input, { isActive: false });
        return { success: true };
      }),

    // Get statistics (admin only)
    getStats: adminProcedure
      .query(async () => {
        await db.updateAdminStats();
        const stats = await db.getAdminStats();
        return stats || { totalUsers: 0, totalProperties: 0, totalViews: 0, totalRentListings: 0, totalSaleListings: 0 };
      }),
  }),
});

export type AppRouter = typeof appRouter;
