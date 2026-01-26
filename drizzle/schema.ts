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
  isActive: boolean("isActive").default(false).notNull(), // perfil ativo/visível no site
  isApproved: boolean("isApproved").default(false).notNull(), // aprovado pelo admin
  approvalStatus: mysqlEnum("approvalStatus", ["pending", "approved", "rejected"]).default("pending").notNull(),
  rejectionReason: text("rejectionReason"), // motivo da rejeição
  isFeatured: boolean("isFeatured").default(false).notNull(), // destaque no banner
  isVip: boolean("isVip").default(false).notNull(),
  isVerified: boolean("isVerified").default(false).notNull(), // perfil verificado
  hasRealPhotos: boolean("hasRealPhotos").default(false).notNull(), // fotos reais verificadas
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

// Tabela de depoimentos verificados
export const testimonials = mysqlTable("testimonials", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId"), // pode ser null para depoimentos gerais
  authorName: varchar("authorName", { length: 255 }).notNull(),
  authorPhoto: text("authorPhoto"), // URL da foto do autor
  content: text("content").notNull(),
  rating: int("rating").notNull(), // 1-5 estrelas
  isVerified: boolean("isVerified").default(false).notNull(), // depoimento verificado
  isFeatured: boolean("isFeatured").default(false).notNull(), // destaque na home
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

// Tabela de pagamentos PIX (controle manual)
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(), // valor em reais
  paymentType: mysqlEnum("paymentType", ["vip", "featured", "verification", "monthly"]).notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }).default("pix").notNull(),
  pixKey: text("pixKey"), // chave PIX usada
  transactionId: varchar("transactionId", { length: 255 }), // ID da transação PIX
  status: mysqlEnum("status", ["pending", "confirmed", "cancelled"]).default("pending").notNull(),
  paidAt: timestamp("paidAt"), // data do pagamento
  confirmedBy: int("confirmedBy"), // ID do admin que confirmou
  notes: text("notes"), // observações do admin
  expiresAt: timestamp("expiresAt"), // data de expiração do serviço
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

// Tabela de logs administrativos
export const adminLogs = mysqlTable("adminLogs", {
  id: int("id").autoincrement().primaryKey(),
  adminId: int("adminId").notNull(), // ID do admin que executou a ação
  action: varchar("action", { length: 100 }).notNull(), // tipo de ação
  targetType: varchar("targetType", { length: 50 }).notNull(), // profile, payment, comment, etc
  targetId: int("targetId"), // ID do item afetado
  details: text("details"), // detalhes da ação em JSON
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AdminLog = typeof adminLogs.$inferSelect;
export type InsertAdminLog = typeof adminLogs.$inferInsert;
