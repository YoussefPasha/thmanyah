-- Create database if not exists
SELECT 'CREATE DATABASE itunes_podcasts_dev'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'itunes_podcasts_dev')\gexec

-- Connect to database
\c itunes_podcasts_dev;

-- Create extension for full text search (if needed in future)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

