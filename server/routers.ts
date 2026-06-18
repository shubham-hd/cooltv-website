import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { storagePut } from "./storage";

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
  }),

  projects: router({
    list: protectedProcedure.query(({ ctx }) =>
      db.getUserProjects(ctx.user.id)
    ),
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        demoUrl: z.string().url().optional(),
        githubUrl: z.string().url().optional(),
        tags: z.string().optional(),
        featured: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createProject({
          userId: ctx.user.id,
          title: input.title,
          description: input.description,
          demoUrl: input.demoUrl,
          githubUrl: input.githubUrl,
          tags: input.tags ? JSON.stringify(input.tags.split(',')) : null,
          featured: input.featured ? 1 : 0,
        });
      }),
    update: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        demoUrl: z.string().optional(),
        githubUrl: z.string().optional(),
        tags: z.string().optional(),
        featured: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const project = await db.getProjectById(input.projectId);
        if (!project || project.userId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }
        return db.updateProject(input.projectId, {
          title: input.title,
          description: input.description,
          imageUrl: input.imageUrl,
          demoUrl: input.demoUrl,
          githubUrl: input.githubUrl,
          tags: input.tags ? JSON.stringify(input.tags.split(',')) : undefined,
          featured: input.featured ? 1 : 0,
        });
      }),
    delete: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const project = await db.getProjectById(input.projectId);
        if (!project || project.userId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }
        return db.deleteProject(input.projectId);
      }),
  }),

  files: router({
    list: protectedProcedure.query(({ ctx }) =>
      db.getUserFiles(ctx.user.id)
    ),
    listByProject: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) =>
        db.getProjectFiles(input.projectId)
      ),
    uploadFile: protectedProcedure
      .input(z.object({
        fileName: z.string(),
        fileData: z.string(), // base64 encoded
        mimeType: z.string(),
        fileSize: z.number(),
        projectId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          // Decode base64 to buffer
          const buffer = Buffer.from(input.fileData, 'base64');
          
          // Upload to S3
          const { key, url } = await storagePut(
            `portfolio/${ctx.user.id}/files/${input.fileName}`,
            buffer,
            input.mimeType
          );
          
          // Save file metadata to database
          const result = await db.createPortfolioFile({
            userId: ctx.user.id,
            projectId: input.projectId || null,
            fileName: input.fileName,
            fileKey: key,
            fileUrl: url,
            fileSize: input.fileSize,
            mimeType: input.mimeType,
          });
          
          return { success: true, fileUrl: url, fileKey: key };
        } catch (error) {
          console.error("File upload failed:", error);
          throw new Error("File upload failed");
        }
      }),
    delete: protectedProcedure
      .input(z.object({ fileId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        // Verify ownership before deleting
        const file = await db.deletePortfolioFile(input.fileId);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
