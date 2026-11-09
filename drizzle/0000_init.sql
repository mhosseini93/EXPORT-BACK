CREATE TABLE "home_content" (
	"id" smallint PRIMARY KEY DEFAULT 1 NOT NULL,
	"content" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
