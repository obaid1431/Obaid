import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema for potential user accounts
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Temporary file storage schema
export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalFilename: text("original_filename").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  userId: integer("user_id").references(() => users.id),
  createdAt: text("created_at").notNull(),
  expiresAt: text("expires_at").notNull(),
});

export const insertFileSchema = createInsertSchema(files).omit({
  id: true,
  userId: true,
});

// Conversion job schema
export const conversionJobs = pgTable("conversion_jobs", {
  id: serial("id").primaryKey(),
  fileId: integer("file_id").references(() => files.id).notNull(),
  outputFileId: integer("output_file_id").references(() => files.id),
  status: text("status").notNull(), // pending, processing, completed, failed
  jobType: text("job_type").notNull(), // extract, convert-word, convert-image, compress, merge
  options: json("options"),
  error: text("error"),
  userId: integer("user_id").references(() => users.id),
  createdAt: text("created_at").notNull(),
});

export const insertConversionJobSchema = createInsertSchema(conversionJobs).omit({
  id: true,
  outputFileId: true,
  error: true,
  userId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type File = typeof files.$inferSelect;
export type InsertFile = z.infer<typeof insertFileSchema>;
export type ConversionJob = typeof conversionJobs.$inferSelect;
export type InsertConversionJob = z.infer<typeof insertConversionJobSchema>;
