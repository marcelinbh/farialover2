import { eq, desc, and, like, sql, or, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  profiles, InsertProfile, Profile,
  categories, InsertCategory, Category,
  profileCategories, InsertProfileCategory,
  photos, InsertPhoto, Photo,
  videos, InsertVideo, Video,
  audios, InsertAudio, Audio,
  comments, InsertComment, Comment
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
}) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(profiles);
  const conditions = [];
  
  if (filters?.city) conditions.push(eq(profiles.city, filters.city));
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
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)!) as any;
  }
  
  return await query.orderBy(desc(profiles.createdAt));
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
