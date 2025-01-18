CREATE TABLE IF NOT EXISTS "communication_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" serial NOT NULL,
	"date" timestamp NOT NULL,
	"communication_type" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hub" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "maths_data_tracker" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" serial NOT NULL,
	"metric_name" text,
	"metric_value" bigint,
	"recorded_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "maths_overview" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" serial NOT NULL,
	"overview" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reading_data_tracker" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" serial NOT NULL,
	"metric_name" text,
	"metric_value" bigint,
	"recorded_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reading_overview" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" serial NOT NULL,
	"overview" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rwi_phonics_data_tracker" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" serial NOT NULL,
	"metric_name" text,
	"metric_value" bigint,
	"recorded_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "student_overview" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"date_of_birth" timestamp,
	"enrollment_date" timestamp,
	"status" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "termly_planning" (
	"id" serial PRIMARY KEY NOT NULL,
	"term_start" timestamp NOT NULL,
	"term_end" timestamp NOT NULL,
	"plan_details" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "weekly_planning" (
	"id" serial PRIMARY KEY NOT NULL,
	"week_start" timestamp NOT NULL,
	"week_end" timestamp NOT NULL,
	"plan_details" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "writing_data_tracker" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" serial NOT NULL,
	"metric_name" text,
	"metric_value" bigint,
	"recorded_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "writing_overview" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" serial NOT NULL,
	"overview" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "communication_log" ADD CONSTRAINT "communication_log_student_id_student_overview_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student_overview"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "maths_data_tracker" ADD CONSTRAINT "maths_data_tracker_student_id_student_overview_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student_overview"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "maths_overview" ADD CONSTRAINT "maths_overview_student_id_student_overview_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student_overview"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reading_data_tracker" ADD CONSTRAINT "reading_data_tracker_student_id_student_overview_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student_overview"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reading_overview" ADD CONSTRAINT "reading_overview_student_id_student_overview_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student_overview"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rwi_phonics_data_tracker" ADD CONSTRAINT "rwi_phonics_data_tracker_student_id_student_overview_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student_overview"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "writing_data_tracker" ADD CONSTRAINT "writing_data_tracker_student_id_student_overview_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student_overview"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "writing_overview" ADD CONSTRAINT "writing_overview_student_id_student_overview_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student_overview"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
