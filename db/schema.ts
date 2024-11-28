import { relations } from "drizzle-orm";
import { boolean, date, integer, interval, numeric, pgEnum, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";

const roleEnum = pgEnum("role", ["USER", "ADMIN"]);

export const user = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: varchar({ length: 255 }).notNull(),
  lastName: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  role: roleEnum().default("USER"),
});

export const userRelations = relations(user, ({ many }) => ({
  task: many(task),
  customTask: many(customTask),
}));

export const category = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar({ length: 50 }).notNull(),
});

export const categoryRelations = relations(category, ({ many }) => ({
  task: many(task),
  customTask: many(customTask),
}));

export const task = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text().notNull(),
  byHour: boolean().default(false),
  duration: interval("duration"),
  date: date().notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  categoryId: uuid("category_id").references(() => category.id),
  userId: uuid("user_id").references(() => user.id),
});

export const taskRelations = relations(task, ({ one }) => ({
  category: one(category, {
    fields: [task.categoryId],
    references: [category.id],
  }),
  user: one(user, {
    fields: [task.userId],
    references: [user.id],
  }),
}));

export const customTask = pgTable("customTask", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text().notNull(),
  duration: interval("duration"),
  date: date().notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  categoryId: uuid("category_id").references(() => category.id),
  userId: uuid("user_id").references(() => user.id),
});

export const customTaskRelations = relations(customTask, ({ one }) => ({
  category: one(category, {
    fields: [customTask.categoryId],
    references: [category.id],
  }),
  user: one(user, {
    fields: [customTask.userId],
    references: [user.id],
  }),
}));
