import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, foreignKey } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

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
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Portfolio Projects table
 * Stores project information for the portfolio
 */
export const projects = mysqlTable(
  "projects",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    imageUrl: text("imageUrl"), // S3 storage URL
    demoUrl: varchar("demoUrl", { length: 2048 }),
    githubUrl: varchar("githubUrl", { length: 2048 }),
    tags: text("tags"), // JSON array of tags
    featured: int("featured").default(0),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
    }),
  ]
);

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

/**
 * Portfolio Files table
 * Stores uploaded files for projects and portfolio
 */
export const portfolioFiles = mysqlTable(
  "portfolio_files",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    projectId: int("projectId"),
    fileName: varchar("fileName", { length: 255 }).notNull(),
    fileKey: varchar("fileKey", { length: 512 }).notNull(), // S3 storage key
    fileUrl: text("fileUrl").notNull(), // S3 storage URL
    fileSize: int("fileSize").notNull(), // File size in bytes
    mimeType: varchar("mimeType", { length: 100 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
    }),
    foreignKey({
      columns: [table.projectId],
      foreignColumns: [projects.id],
    }),
  ]
);

export type PortfolioFile = typeof portfolioFiles.$inferSelect;
export type InsertPortfolioFile = typeof portfolioFiles.$inferInsert;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  files: many(portfolioFiles),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  files: many(portfolioFiles),
}));

export const portfolioFilesRelations = relations(portfolioFiles, ({ one }) => ({
  user: one(users, {
    fields: [portfolioFiles.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [portfolioFiles.projectId],
    references: [projects.id],
  }),
}));