ALTER TABLE "User" ADD COLUMN "googleId" varchar(128);--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "googleAccessToken" text;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "googleRefreshToken" text;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "userType" varchar DEFAULT 'regular' NOT NULL;