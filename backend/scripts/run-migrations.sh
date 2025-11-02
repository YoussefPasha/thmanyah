#!/bin/sh
# Script to run database migrations
# This should be run before starting the application in production

set -e

echo "🔄 Running database migrations..."

# Run TypeORM migrations
npm run migration:run

echo "✅ Migrations completed successfully!"

exit 0

