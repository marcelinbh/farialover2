import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Tabela de perfis de acompanhantes
export const profiles = mysqlTable("profiles", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  age: int("age").notNull(),
  height: decimal("height", { precision: 4, scale: 2 }), // em metros, ex: 1.65
  weight: int("weight"), // em kg
  phone: varchar("phone", { length: 20 }).notNull(),
  city: varchar("city", { length: 255 }).notNull(),
  region: varchar("region", { length: 255 }), // bairro/região
  description: text("description"),
  photoUrl: text("photoUrl"), // URL da foto principal
  photoKey: text("photoKey"), // chave S3 da foto principal
  isActive: boolean("isActive").default(true).notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(), // destaque no banner
  isVip: boolean("isVip").default(false).notNull(),
  viewCount: int("viewCount").default(0).notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"), // média de avaliações
  ratingCount: int("ratingCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;

// Tabela de categorias/tags de serviços
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  color: varchar("color", { length: 7 }).default("#8B00FF"), // cor hexadecimal
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

// Tabela de relacionamento perfil-categoria (muitos para muitos)
export const profileCategories = mysqlTable("profile_categories", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  categoryId: int("categoryId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProfileCategory = typeof profileCategories.$inferSelect;
export type InsertProfileCategory = typeof profileCategories.$inferInsert;

// Tabela de fotos adicionais dos perfis
export const photos = mysqlTable("photos", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  url: text("url").notNull(),
  fileKey: text("fileKey").notNull(),
  order: int("order").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Photo = typeof photos.$inferSelect;
export type InsertPhoto = typeof photos.$inferInsert;

// Tabela de vídeos
export const videos = mysqlTable("videos", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  title: varchar("title", { length: 255 }),
  url: text("url").notNull(),
  fileKey: text("fileKey").notNull(),
  thumbnailUrl: text("thumbnailUrl"),
  thumbnailKey: text("thumbnailKey"),
  duration: int("duration"), // em segundos
  viewCount: int("viewCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Video = typeof videos.$inferSelect;
export type InsertVideo = typeof videos.$inferInsert;

// Tabela de áudios
export const audios = mysqlTable("audios", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  title: varchar("title", { length: 255 }),
  url: text("url").notNull(),
  fileKey: text("fileKey").notNull(),
  duration: int("duration"), // em segundos
  playCount: int("playCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Audio = typeof audios.$inferSelect;
export type InsertAudio = typeof audios.$inferInsert;

// Tabela de comentários e avaliações
export const comments = mysqlTable("comments", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  userId: int("userId"), // pode ser null para comentários anônimos
  authorName: varchar("authorName", { length: 255 }).notNull(),
  content: text("content").notNull(),
  rating: int("rating").notNull(), // 1-5 estrelas
  isApproved: boolean("isApproved").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;
