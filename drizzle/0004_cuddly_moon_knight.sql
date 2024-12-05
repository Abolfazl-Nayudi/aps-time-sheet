ALTER TABLE "tasks" RENAME COLUMN "byHour" TO "isByHour";--> statement-breakpoint
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN IF EXISTS "user_id";