import { eq, desc, and, like, sql, or, inArray, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  profiles, InsertProfile, Profile,
  categories, InsertCategory, Category,
  profileCategories, InsertProfileCategory,
  photos, InsertPhoto, Photo,
  videos, InsertVideo, Video,
  audios, InsertAudio, Audio,
  comments, InsertComment, Comment,
  testimonials, InsertTestimonial, Testimonial,
  payments, InsertPayment, Payment,
  adminLogs, InsertAdminLog, AdminLog
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

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

// ===== USER OPERATIONS =====
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
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
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

    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== PROFILE OPERATIONS =====
export async function createProfile(profile: InsertProfile) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(profiles).values(profile);
  return result;
}

export async function getProfileById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(profiles).where(eq(profiles.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getAllProfiles(filters?: {
  city?: string;
  region?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isVip?: boolean;
  search?: string;
  ageMin?: number;
  ageMax?: number;
  heightMin?: number;
  heightMax?: number;
  weightMin?: number;
  weightMax?: number;
  categoryIds?: number[];
}) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(profiles);
  const conditions = [];
  
  if (filters?.city) conditions.push(like(profiles.city, `%${filters.city}%`));
  if (filters?.region) conditions.push(like(profiles.region, `%${filters.region}%`));
  if (filters?.isActive !== undefined) conditions.push(eq(profiles.isActive, filters.isActive));
  if (filters?.isFeatured !== undefined) conditions.push(eq(profiles.isFeatured, filters.isFeatured));
  if (filters?.isVip !== undefined) conditions.push(eq(profiles.isVip, filters.isVip));
  if (filters?.search) {
    conditions.push(
      or(
        like(profiles.name, `%${filters.search}%`),
        like(profiles.description, `%${filters.search}%`)
      )!
    );
  }
  
  // Filtros de idade
  if (filters?.ageMin !== undefined) conditions.push(gte(profiles.age, filters.ageMin));
  if (filters?.ageMax !== undefined) conditions.push(lte(profiles.age, filters.ageMax));
  
  // Filtros de altura (convertendo cm para metros)
  if (filters?.heightMin !== undefined) conditions.push(gte(profiles.height, String(filters.heightMin / 100)));
  if (filters?.heightMax !== undefined) conditions.push(lte(profiles.height, String(filters.heightMax / 100)));
  
  // Filtros de peso
  if (filters?.weightMin !== undefined) conditions.push(gte(profiles.weight, filters.weightMin));
  if (filters?.weightMax !== undefined) conditions.push(lte(profiles.weight, filters.weightMax));
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)!) as any;
  }
  
  let results = await query.orderBy(desc(profiles.createdAt));
  
  // Filtrar por categorias se fornecido
  if (filters?.categoryIds && filters.categoryIds.length > 0) {
    const profilesWithCategories = await Promise.all(
      results.map(async (profile) => {
        const categories = await getProfileCategories(profile.id);
        const hasCategory = categories.some(cat => filters.categoryIds!.includes(cat.id));
        return hasCategory ? profile : null;
      })
    );
    results = profilesWithCategories.filter(p => p !== null) as typeof results;
  }
  
  return results;
}

export async function updateProfile(id: number, data: Partial<InsertProfile>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(profiles).set(data).where(eq(profiles.id, id));
}

export async function deleteProfile(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(profiles).where(eq(profiles.id, id));
}

export async function incrementProfileViews(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(profiles).set({ viewCount: sql`${profiles.viewCount} + 1` }).where(eq(profiles.id, id));
}

// ===== CATEGORY OPERATIONS =====
export async function createCategory(category: InsertCategory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(categories).values(category);
}

export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(categories).orderBy(categories.name);
}

export async function getCategoryById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateCategory(id: number, data: Partial<InsertCategory>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(categories).set(data).where(eq(categories.id, id));
}

export async function deleteCategory(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(categories).where(eq(categories.id, id));
}

// ===== PROFILE-CATEGORY OPERATIONS =====
export async function addCategoryToProfile(profileId: number, categoryId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(profileCategories).values({ profileId, categoryId });
}

export async function removeCategoryFromProfile(profileId: number, categoryId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(profileCategories).where(
    and(eq(profileCategories.profileId, profileId), eq(profileCategories.categoryId, categoryId))
  );
}

export async function getProfileCategories(profileId: number) {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select({
    category: categories
  })
  .from(profileCategories)
  .innerJoin(categories, eq(profileCategories.categoryId, categories.id))
  .where(eq(profileCategories.profileId, profileId));
  
  return result.map(r => r.category);
}

// ===== PHOTO OPERATIONS =====
export async function addPhoto(photo: InsertPhoto) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(photos).values(photo);
}

export async function getProfilePhotos(profileId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(photos).where(eq(photos.profileId, profileId)).orderBy(photos.order);
}

export async function deletePhoto(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(photos).where(eq(photos.id, id));
}

// ===== VIDEO OPERATIONS =====
export async function addVideo(video: InsertVideo) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(videos).values(video);
}

export async function getProfileVideos(profileId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(videos).where(eq(videos.profileId, profileId)).orderBy(desc(videos.createdAt));
}

export async function getAllVideos() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(videos).orderBy(desc(videos.createdAt));
}

export async function deleteVideo(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(videos).where(eq(videos.id, id));
}

export async function incrementVideoViews(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(videos).set({ viewCount: sql`${videos.viewCount} + 1` }).where(eq(videos.id, id));
}

// ===== AUDIO OPERATIONS =====
export async function addAudio(audio: InsertAudio) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(audios).values(audio);
}

export async function getProfileAudios(profileId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(audios).where(eq(audios.profileId, profileId)).orderBy(desc(audios.createdAt));
}

export async function getAllAudios() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(audios).orderBy(desc(audios.createdAt));
}

export async function deleteAudio(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(audios).where(eq(audios.id, id));
}

export async function incrementAudioPlays(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(audios).set({ playCount: sql`${audios.playCount} + 1` }).where(eq(audios.id, id));
}

// ===== COMMENT OPERATIONS =====
export async function addComment(comment: InsertComment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(comments).values(comment);
}

export async function getProfileComments(profileId: number, approvedOnly: boolean = true) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [eq(comments.profileId, profileId)];
  if (approvedOnly) {
    conditions.push(eq(comments.isApproved, true));
  }
  
  return await db.select().from(comments).where(and(...conditions)!).orderBy(desc(comments.createdAt));
}

export async function getAllComments(approvedOnly?: boolean) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(comments);
  
  if (approvedOnly !== undefined) {
    query = query.where(eq(comments.isApproved, approvedOnly)) as any;
  }
  
  return await query.orderBy(desc(comments.createdAt));
}

export async function approveComment(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(comments).set({ isApproved: true }).where(eq(comments.id, id));
}

export async function deleteComment(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(comments).where(eq(comments.id, id));
}

export async function updateProfileRating(profileId: number) {
  const db = await getDb();
  if (!db) return;
  
  const approvedComments = await getProfileComments(profileId, true);
  const totalRating = approvedComments.reduce((sum, c) => sum + c.rating, 0);
  const avgRating = approvedComments.length > 0 ? (totalRating / approvedComments.length).toFixed(2) : "0.00";
  
  await db.update(profiles).set({
    rating: avgRating,
    ratingCount: approvedComments.length
  }).where(eq(profiles.id, profileId));
}

// ===== TESTIMONIALS =====
export async function createTestimonial(data: InsertTestimonial) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(testimonials).values(data);
}

export async function getAllTestimonials(filters?: {
  profileId?: number;
  isVerified?: boolean;
  isFeatured?: boolean;
}) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(testimonials);
  const conditions = [];
  
  if (filters?.profileId !== undefined) conditions.push(eq(testimonials.profileId, filters.profileId));
  if (filters?.isVerified !== undefined) conditions.push(eq(testimonials.isVerified, filters.isVerified));
  if (filters?.isFeatured !== undefined) conditions.push(eq(testimonials.isFeatured, filters.isFeatured));
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)!) as any;
  }
  
  return await query.orderBy(desc(testimonials.createdAt));
}

export async function getTestimonialById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(testimonials).where(eq(testimonials.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateTestimonial(id: number, data: Partial<InsertTestimonial>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(testimonials).set(data).where(eq(testimonials.id, id));
}

export async function deleteTestimonial(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(testimonials).where(eq(testimonials.id, id));
}

// ===== PAYMENTS =====
export async function createPayment(data: InsertPayment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(payments).values(data);
}

export async function getAllPayments(filters?: {
  profileId?: number;
  status?: "pending" | "confirmed" | "cancelled";
  paymentType?: "vip" | "featured" | "verification" | "monthly";
}) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(payments);
  const conditions = [];
  
  if (filters?.profileId !== undefined) conditions.push(eq(payments.profileId, filters.profileId));
  if (filters?.status !== undefined) conditions.push(eq(payments.status, filters.status));
  if (filters?.paymentType !== undefined) conditions.push(eq(payments.paymentType, filters.paymentType));
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)!) as any;
  }
  
  return await query.orderBy(desc(payments.createdAt));
}

export async function getPaymentById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(payments).where(eq(payments.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updatePayment(id: number, data: Partial<InsertPayment>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(payments).set(data).where(eq(payments.id, id));
}

export async function confirmPayment(id: number, adminId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(payments).set({
    status: "confirmed",
    paidAt: new Date(),
    confirmedBy: adminId,
  }).where(eq(payments.id, id));
}

export async function deletePayment(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(payments).where(eq(payments.id, id));
}

// ===== ADMIN LOGS =====
export async function createAdminLog(data: InsertAdminLog) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(adminLogs).values(data);
}

export async function getAdminLogs(filters?: {
  adminId?: number;
  action?: string;
  targetType?: string;
  limit?: number;
}) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(adminLogs);
  const conditions = [];
  
  if (filters?.adminId !== undefined) conditions.push(eq(adminLogs.adminId, filters.adminId));
  if (filters?.action !== undefined) conditions.push(eq(adminLogs.action, filters.action));
  if (filters?.targetType !== undefined) conditions.push(eq(adminLogs.targetType, filters.targetType));
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)!) as any;
  }
  
  const result = await query.orderBy(desc(adminLogs.createdAt));
  
  if (filters?.limit) {
    return result.slice(0, filters.limit);
  }
  
  return result;
}

// ===== ADMIN PROFILE MANAGEMENT =====
export async function approveProfile(profileId: number, adminId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(profiles).set({
    isApproved: true,
    approvalStatus: "approved",
    isActive: true,
    rejectionReason: null,
  }).where(eq(profiles.id, profileId));
  
  await createAdminLog({
    adminId,
    action: "approve_profile",
    targetType: "profile",
    targetId: profileId,
    details: JSON.stringify({ profileId }),
  });
  
  return { success: true };
}

export async function rejectProfile(profileId: number, adminId: number, reason: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(profiles).set({
    isApproved: false,
    approvalStatus: "rejected",
    isActive: false,
    rejectionReason: reason,
  }).where(eq(profiles.id, profileId));
  
  await createAdminLog({
    adminId,
    action: "reject_profile",
    targetType: "profile",
    targetId: profileId,
    details: JSON.stringify({ profileId, reason }),
  });
  
  return { success: true };
}

export async function toggleProfileActive(profileId: number, adminId: number, isActive: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(profiles).set({ isActive }).where(eq(profiles.id, profileId));
  
  await createAdminLog({
    adminId,
    action: isActive ? "activate_profile" : "deactivate_profile",
    targetType: "profile",
    targetId: profileId,
    details: JSON.stringify({ profileId, isActive }),
  });
  
  return { success: true };
}

export async function toggleProfileFeature(profileId: number, adminId: number, feature: "isFeatured" | "isVip" | "isVerified" | "hasRealPhotos", value: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(profiles).set({ [feature]: value }).where(eq(profiles.id, profileId));
  
  await createAdminLog({
    adminId,
    action: `toggle_${feature}`,
    targetType: "profile",
    targetId: profileId,
    details: JSON.stringify({ profileId, feature, value }),
  });
  
  return { success: true };
}
