import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Podcast } from '../modules/podcast/entities/podcast.entity';
import { PodcastJob } from '../modules/podcast/entities/podcast-job.entity';

// Load environment variables
config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'itunes_podcasts_dev',
  entities: [Podcast, PodcastJob],
  migrations: ['src/migrations/**/*.ts'],
  migrationsTableName: 'migrations',
  logging: process.env.DB_LOGGING === 'true',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

