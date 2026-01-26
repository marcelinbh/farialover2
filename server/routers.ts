import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";
import { TRPCError } from "@trpc/server";

// Helper para gerar sufixo aleatório
const randomSuffix = () => nanoid(8);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ===== PROFILE ROUTES =====
  profiles: router({
    list: publicProcedure
      .input(z.object({
        city: z.string().optional(),
        region: z.string().optional(),
        search: z.string().optional(),
        isVip: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
        ageMin: z.number().optional(),
        ageMax: z.number().optional(),
        heightMin: z.number().optional(),
        heightMax: z.number().optional(),
        weightMin: z.number().optional(),
        weightMax: z.number().optional(),
        categoryIds: z.array(z.number()).optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getAllProfiles({ ...input, isActive: true });
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const profile = await db.getProfileById(input.id);
        if (profile) {
          await db.incrementProfileViews(input.id);
        }
        return profile;
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        age: z.number().min(18),
        height: z.string().optional(),
        weight: z.number().optional(),
        phone: z.string().min(1),
        city: z.string().min(1),
        region: z.string().optional(),
        description: z.string().optional(),
        isVip: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return await db.createProfile(input);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        age: z.number().optional(),
        height: z.string().optional(),
        weight: z.number().optional(),
        phone: z.string().optional(),
        city: z.string().optional(),
        region: z.string().optional(),
        description: z.string().optional(),
        isActive: z.boolean().optional(),
        isVip: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        const { id, ...data } = input;
        return await db.updateProfile(id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return await db.deleteProfile(input.id);
      }),

    uploadPhoto: protectedProcedure
      .input(z.object({
        profileId: z.number(),
        imageData: z.string(), // base64
        filename: z.string(),
        isMainPhoto: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }

        const buffer = Buffer.from(input.imageData.split(',')[1] || input.imageData, 'base64');
        const fileKey = `profiles/${input.profileId}/photos/${input.filename}-${randomSuffix()}`;
        const { url } = await storagePut(fileKey, buffer, 'image/jpeg');

        if (input.isMainPhoto) {
          await db.updateProfile(input.profileId, { photoUrl: url, photoKey: fileKey });
        } else {
          await db.addPhoto({ profileId: input.profileId, url, fileKey, order: 0 });
        }

        return { url, fileKey };
      }),

    getPhotos: publicProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        return await db.getProfilePhotos(input.profileId);
      }),

    getCategories: publicProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        return await db.getProfileCategories(input.profileId);
      }),

    addCategory: protectedProcedure
      .input(z.object({
        profileId: z.number(),
        categoryId: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return await db.addCategoryToProfile(input.profileId, input.categoryId);
      }),

    removeCategory: protectedProcedure
      .input(z.object({
        profileId: z.number(),
        categoryId: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return await db.removeCategoryFromProfile(input.profileId, input.categoryId);
      }),
  }),

  // ===== CATEGORY ROUTES =====
  categories: router({
    list: publicProcedure.query(async () => {
      return await db.getAllCategories();
    }),

    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
        color: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return await db.createCategory(input);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        color: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        const { id, ...data } = input;
        return await db.updateCategory(id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return await db.deleteCategory(input.id);
      }),
  }),

  // ===== VIDEO ROUTES =====
  videos: router({
    list: publicProcedure
      .input(z.object({ profileId: z.number().optional() }).optional())
      .query(async ({ input }) => {
        if (input?.profileId) {
          return await db.getProfileVideos(input.profileId);
        }
        return await db.getAllVideos();
      }),

    upload: protectedProcedure
      .input(z.object({
        profileId: z.number(),
        title: z.string().optional(),
        videoData: z.string(), // base64
        filename: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }

        const buffer = Buffer.from(input.videoData.split(',')[1] || input.videoData, 'base64');
        const fileKey = `profiles/${input.profileId}/videos/${input.filename}-${randomSuffix()}`;
        const { url } = await storagePut(fileKey, buffer, 'video/mp4');

        return await db.addVideo({
          profileId: input.profileId,
          title: input.title,
          url,
          fileKey,
        });
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return await db.deleteVideo(input.id);
      }),

    incrementViews: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.incrementVideoViews(input.id);
      }),
  }),

  // ===== AUDIO ROUTES =====
  audios: router({
    list: publicProcedure
      .input(z.object({ profileId: z.number().optional() }).optional())
      .query(async ({ input }) => {
        if (input?.profileId) {
          return await db.getProfileAudios(input.profileId);
        }
        return await db.getAllAudios();
      }),

    upload: protectedProcedure
      .input(z.object({
        profileId: z.number(),
        title: z.string().optional(),
        audioData: z.string(), // base64
        filename: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }

        const buffer = Buffer.from(input.audioData.split(',')[1] || input.audioData, 'base64');
        const fileKey = `profiles/${input.profileId}/audios/${input.filename}-${randomSuffix()}`;
        const { url } = await storagePut(fileKey, buffer, 'audio/mpeg');

        return await db.addAudio({
          profileId: input.profileId,
          title: input.title,
          url,
          fileKey,
        });
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return await db.deleteAudio(input.id);
      }),

    incrementPlays: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.incrementAudioPlays(input.id);
      }),
  }),

  // ===== COMMENT ROUTES =====
  comments: router({
    list: publicProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        return await db.getProfileComments(input.profileId, true);
      }),

    listAll: protectedProcedure
      .input(z.object({ approvedOnly: z.boolean().optional() }).optional())
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return await db.getAllComments(input?.approvedOnly);
      }),

    create: publicProcedure
      .input(z.object({
        profileId: z.number(),
        authorName: z.string().min(1),
        content: z.string().min(1),
        rating: z.number().min(1).max(5),
      }))
      .mutation(async ({ input, ctx }) => {
        const result = await db.addComment({
          ...input,
          userId: ctx.user?.id,
          isApproved: false,
        });
        return result;
      }),

    approve: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        await db.approveComment(input.id);
        
        // Atualizar rating do perfil
        const comment = (await db.getAllComments()).find(c => c.id === input.id);
        if (comment) {
          await db.updateProfileRating(comment.profileId);
        }
        
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return await db.deleteComment(input.id);
      }),
  }),

  // ===== TESTIMONIALS ROUTES =====
  testimonials: router({
    list: publicProcedure
      .input(z.object({
        profileId: z.number().optional(),
        isVerified: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getAllTestimonials(input);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getTestimonialById(input.id);
      }),

    create: protectedProcedure
      .input(z.object({
        profileId: z.number().optional(),
        authorName: z.string().min(1),
        authorPhoto: z.string().optional(),
        content: z.string().min(1),
        rating: z.number().min(1).max(5),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return await db.createTestimonial({
          ...input,
          isVerified: true,
          isFeatured: false,
        });
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        authorName: z.string().optional(),
        authorPhoto: z.string().optional(),
        content: z.string().optional(),
        rating: z.number().min(1).max(5).optional(),
        isVerified: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        const { id, ...data } = input;
        return await db.updateTestimonial(id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return await db.deleteTestimonial(input.id);
      }),
  }),

  // ===== ADMIN ROUTES =====
  admin: router({
    // Gerenciamento de Perfis
    approveProfile: protectedProcedure
      .input(z.object({ profileId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return await db.approveProfile(input.profileId, ctx.user.id);
      }),

    rejectProfile: protectedProcedure
      .input(z.object({ profileId: z.number(), reason: z.string().min(1) }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return await db.rejectProfile(input.profileId, ctx.user.id, input.reason);
      }),

    toggleProfileActive: protectedProcedure
      .input(z.object({ profileId: z.number(), isActive: z.boolean() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return await db.toggleProfileActive(input.profileId, ctx.user.id, input.isActive);
      }),

    toggleProfileFeature: protectedProcedure
      .input(z.object({
        profileId: z.number(),
        feature: z.enum(["isFeatured", "isVip", "isVerified", "hasRealPhotos"]),
        value: z.boolean(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return await db.toggleProfileFeature(input.profileId, ctx.user.id, input.feature, input.value);
      }),

    // Gerenciamento de Pagamentos
    getPayments: protectedProcedure
      .input(z.object({
        profileId: z.number().optional(),
        status: z.enum(["pending", "confirmed", "cancelled"]).optional(),
        paymentType: z.enum(["vip", "featured", "verification", "monthly"]).optional(),
      }).optional())
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return await db.getAllPayments(input);
      }),

    createPayment: protectedProcedure
      .input(z.object({
        profileId: z.number(),
        amount: z.string(),
        paymentType: z.enum(["vip", "featured", "verification", "monthly"]),
        pixKey: z.string().optional(),
        transactionId: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return await db.createPayment({
          ...input,
          status: "pending",
        });
      }),

    confirmPayment: protectedProcedure
      .input(z.object({ paymentId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        await db.confirmPayment(input.paymentId, ctx.user.id);
        
        await db.createAdminLog({
          adminId: ctx.user.id,
          action: "confirm_payment",
          targetType: "payment",
          targetId: input.paymentId,
          details: JSON.stringify({ paymentId: input.paymentId }),
        });
        
        return { success: true };
      }),

    updatePayment: protectedProcedure
      .input(z.object({
        id: z.number(),
        amount: z.string().optional(),
        status: z.enum(["pending", "confirmed", "cancelled"]).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        const { id, ...data } = input;
        return await db.updatePayment(id, data);
      }),

    deletePayment: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return await db.deletePayment(input.id);
      }),

    // Logs Administrativos
    getLogs: protectedProcedure
      .input(z.object({
        adminId: z.number().optional(),
        action: z.string().optional(),
        targetType: z.string().optional(),
        limit: z.number().optional(),
      }).optional())
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return await db.getAdminLogs(input);
      }),

    // Dashboard Stats
    getStats: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        
        const allProfiles = await db.getAllProfiles();
        const allPayments = await db.getAllPayments();
        const allComments = await db.getAllComments();
        
        return {
          totalProfiles: allProfiles.length,
          activeProfiles: allProfiles.filter(p => p.isActive).length,
          pendingApproval: allProfiles.filter(p => p.approvalStatus === 'pending').length,
          vipProfiles: allProfiles.filter(p => p.isVip).length,
          featuredProfiles: allProfiles.filter(p => p.isFeatured).length,
          totalPayments: allPayments.length,
          pendingPayments: allPayments.filter(p => p.status === 'pending').length,
          confirmedPayments: allPayments.filter(p => p.status === 'confirmed').length,
          totalRevenue: allPayments
            .filter(p => p.status === 'confirmed')
            .reduce((sum, p) => sum + parseFloat(p.amount as string), 0)
            .toFixed(2),
          pendingComments: allComments.filter(c => !c.isApproved).length,
          approvedComments: allComments.filter(c => c.isApproved).length,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
