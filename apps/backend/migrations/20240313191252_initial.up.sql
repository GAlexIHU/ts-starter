CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "example_entity" (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "title" text NOT NULL,
  "description" text NOT NULL
);