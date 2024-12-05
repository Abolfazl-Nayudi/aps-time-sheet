CREATE TABLE IF NOT EXISTS "user_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"taskId" uuid NOT NULL,
	"duration" interval,
	"date" date NOT NULL,
	"notes" text
);
--> statement-breakpoint
ALTER TABLE "customTask" ALTER COLUMN "category_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "customTask" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "byHour" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "price" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "category_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_tasks" ADD CONSTRAINT "user_tasks_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_tasks" ADD CONSTRAINT "user_tasks_taskId_tasks_id_fk" FOREIGN KEY ("taskId") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
