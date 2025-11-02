#!/bin/bash
# Script to run migrations in Docker production environment
# Usage: ./docker-migrate.sh

set -e

echo "🔄 Running database migrations in Docker production environment..."

# Build and run a temporary container to execute migrations
docker-compose -f ../docker-compose.prod.yml run --rm \
  -e DB_SYNCHRONIZE=false \
  backend \
  npm run migration:run

echo "✅ Migrations completed successfully!"
echo "You can now start the application with: docker-compose -f docker-compose.prod.yml up -d"

