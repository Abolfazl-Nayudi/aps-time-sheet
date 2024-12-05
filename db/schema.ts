import { relations } from "drizzle-orm";
import { boolean, date, integer, interval, numeric, pgEnum, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";

const roleEnum = pgEnum("role", ["USER", "ADMIN"]);

export const userTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  firstName: varchar({ length: 255 }).notNull(),
  lastName: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  role: roleEnum().default("USER").notNull(),
});

export const usersRelations = relations(userTable, ({ many }) => ({
  userTasks: many(userTaskTable),
  customTasks: many(customTaskTable),
}));

export const categoryTable = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: varchar({ length: 50 }).notNull(),
});

export const categoryRelations = relations(categoryTable, ({ many }) => ({
  task: many(taskTable),
  customTask: many(customTaskTable),
}));

export const taskTable = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: text().notNull(),
  byHour: boolean().default(false).notNull(),
  duration: interval("duration"),
  date: date().notNull(),
  price: numeric("price", { precision: 10, scale: 2 }),
  categoryId: uuid("category_id")
    .references(() => categoryTable.id)
    .notNull(),
  userId: uuid("user_id")
    .references(() => userTable.id)
    .notNull(),
});

export const tasksRelations = relations(taskTable, ({ many }) => ({
  userTasks: many(userTaskTable),
}));

export const userTaskTable = pgTable("user_tasks", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => userTable.id),
  taskId: uuid("taskId")
    .notNull()
    .references(() => taskTable.id),
  duration: interval("duration"),
  date: date().notNull(),
  notes: text("notes"),
});

export const userTasksRelations = relations(userTaskTable, ({ one }) => ({
  user: one(userTable, { fields: [userTaskTable.userId], references: [userTable.id] }),
  task: one(taskTable, { fields: [userTaskTable.taskId], references: [taskTable.id] }),
}));

export const customTaskTable = pgTable("customTask", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: text().notNull(),
  duration: interval("duration"),
  date: date().notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  categoryId: uuid("category_id")
    .references(() => categoryTable.id)
    .notNull(),
  userId: uuid("user_id")
    .references(() => userTable.id)
    .notNull(),
});

export const customTaskRelations = relations(customTaskTable, ({ one }) => ({
  category: one(categoryTable, {
    fields: [customTaskTable.categoryId],
    references: [categoryTable.id],
  }),
  user: one(userTable, {
    fields: [customTaskTable.userId],
    references: [userTable.id],
  }),
}));
