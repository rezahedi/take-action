CREATE TABLE "missions" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"content" text NOT NULL,
	"image_url" text,
	"published" boolean DEFAULT false NOT NULL,
	"author_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "missions_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "missions" ADD CONSTRAINT "missions_author_id_users_sync_id_fk" FOREIGN KEY ("author_id") REFERENCES "neon_auth"."users_sync"("id") ON DELETE no action ON UPDATE no action;