import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1730592000000 implements MigrationInterface {
  name = 'InitialSchema1730592000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create podcasts table
    await queryRunner.query(`
      CREATE TABLE "podcasts" (
        "id" SERIAL NOT NULL,
        "track_id" bigint NOT NULL,
        "track_name" character varying(500) NOT NULL,
        "artist_name" character varying(255),
        "collection_name" character varying(500),
        "artwork_url_60" character varying(1000),
        "artwork_url_100" character varying(1000),
        "artwork_url_600" character varying(1000),
        "feed_url" text,
        "track_view_url" text,
        "release_date" TIMESTAMP,
        "country" character varying(10),
        "primary_genre_name" character varying(100),
        "genre_ids" text,
        "genres" text,
        "track_count" integer,
        "track_explicit_content" boolean NOT NULL DEFAULT false,
        "description" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_podcasts_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_podcasts_track_id" UNIQUE ("track_id")
      )
    `);

    // Create indexes for podcasts table
    await queryRunner.query(`
      CREATE INDEX "IDX_podcasts_track_id" ON "podcasts" ("track_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_podcasts_primary_genre_name" ON "podcasts" ("primary_genre_name")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_podcasts_created_at" ON "podcasts" ("created_at")
    `);

    // Create podcast_jobs table
    await queryRunner.query(`
      CREATE TABLE "podcast_jobs" (
        "id" SERIAL NOT NULL,
        "track_id" bigint NOT NULL,
        "track_name" character varying(500) NOT NULL,
        "podcast_data" jsonb NOT NULL,
        "status" character varying(20) NOT NULL DEFAULT 'pending',
        "attempts" integer NOT NULL DEFAULT 0,
        "max_attempts" integer NOT NULL DEFAULT 3,
        "error" text,
        "last_attempt_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "completed_at" TIMESTAMP,
        CONSTRAINT "PK_podcast_jobs_id" PRIMARY KEY ("id")
      )
    `);

    // Create indexes for podcast_jobs table
    await queryRunner.query(`
      CREATE INDEX "IDX_podcast_jobs_track_id" ON "podcast_jobs" ("track_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_podcast_jobs_status" ON "podcast_jobs" ("status")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_podcast_jobs_status_created_at" ON "podcast_jobs" ("status", "created_at")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop podcast_jobs indexes
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_podcast_jobs_status_created_at"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_podcast_jobs_status"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_podcast_jobs_track_id"
    `);

    // Drop podcast_jobs table
    await queryRunner.query(`
      DROP TABLE IF EXISTS "podcast_jobs"
    `);

    // Drop podcasts indexes
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_podcasts_created_at"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_podcasts_primary_genre_name"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_podcasts_track_id"
    `);

    // Drop podcasts table
    await queryRunner.query(`
      DROP TABLE IF EXISTS "podcasts"
    `);
  }
}

