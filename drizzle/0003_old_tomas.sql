ALTER TABLE "actionStats" RENAME TO "action_stats";--> statement-breakpoint
ALTER TABLE "action_stats" DROP CONSTRAINT "actionStats_action_id_actions_id_fk";
--> statement-breakpoint
ALTER TABLE "action_stats" DROP CONSTRAINT "actionStats_author_id_users_sync_id_fk";
--> statement-breakpoint
ALTER TABLE "action_stats" ADD CONSTRAINT "action_stats_action_id_actions_id_fk" FOREIGN KEY ("action_id") REFERENCES "public"."actions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action_stats" ADD CONSTRAINT "action_stats_author_id_users_sync_id_fk" FOREIGN KEY ("author_id") REFERENCES "neon_auth"."users_sync"("id") ON DELETE no action ON UPDATE no action;