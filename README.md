# iTunes Podcast Search Application

A full-stack application that integrates with the iTunes Search API to search, store, and display podcast information. Built with NestJS (backend), Next.js (frontend), and PostgreSQL (database).

## ✨ Features

- **Podcast Search** - Search for podcasts using the iTunes Search API
- **Advanced Pagination** - Configurable result limits (1-200), country filtering, and entity type filtering
- **Multi-Country Search** - Search in different iTunes stores (US, CA, UK, JP, etc.)
- **Entity Filtering** - Search for podcasts or podcast authors separately
- **Data Persistence** - Automatically saves search results to PostgreSQL database
- **Browse Database** - View all stored podcasts on the landing page
- **Modern UI** - Beautiful, responsive interface with gradient effects and animations
- **URL-Based Search** - Share search results via URL (`/search?q=keyword`)
- **Real-time Search** - Instant search results as you type
- **Detailed Views** - Comprehensive podcast information with artwork and metadata
- **Loading States** - Skeleton loaders for better user experience
- **Responsive Design** - Fully responsive across mobile, tablet, and desktop
- **Docker Support** - Fully containerized with Docker Compose
- **Comprehensive Error Handling** - Beautiful error pages with custom SVG illustrations for 404, 500, 429 (rate limiting), and more
- **Error Recovery** - Automatic error detection with retry functionality
- **Animated UX** - Smooth animations and transitions for error states
- **iTunes API Rate Limiting** - Intelligent rate limit handling with exponential backoff, request caching, and automatic retry logic
- **Request Throttling** - Proactive rate limiting to prevent hitting iTunes API limits
- **Response Caching** - In-memory caching (5-minute TTL) reduces redundant API calls and improves performance

## 🛠️ Tech Stack

**Backend:** NestJS, TypeORM, PostgreSQL, Axios  
**Frontend:** Next.js 14, TypeScript, Tailwind CSS, SWR, Radix UI, Lucide Icons  
**Database:** PostgreSQL with TypeORM migrations for schema management

## 🚀 How to Run

### Using Docker (Recommended)

1. **Start all services:**
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

2. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api/v1
   - Health Check: http://localhost:8080/api/v1/health

3. **Stop services:**
   ```bash
   docker-compose -f docker-compose.dev.yml down
   ```

### Manual Setup

#### Backend

```bash
cd backend
npm install
cp .env.example .env  # Configure your environment variables
npm run migration:run # Run database migrations
npm run start:dev     # Runs on http://localhost:8080
```

#### Frontend

```bash
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1" > .env.local
npm run dev           # Runs on http://localhost:3000
```

## 📖 Usage

1. **Browse Podcasts** - Visit http://localhost:3000 to see podcasts from the database
2. **Search from Homepage** - Type in the search box and press Enter
3. **Direct URL Search** - Access http://localhost:3000/search?q=your-term
4. **Use Advanced Filters** - On search page, filter by:
   - **Results Limit**: 20, 50, 100, or 200 results
   - **Country**: Search in different iTunes stores (US, Saudi Arabia, UAE, Egypt, UK, etc.)
   - **Entity Type**: Search for podcasts or podcast authors
5. **Share Search Results** - URL updates with filters, making searches shareable
6. **View Details** - Click any podcast card to see more information

### Search Examples

```
# Basic search
/search?q=javascript

# Custom filters
/search?q=technology&limit=100&country=us&entity=podcast

# Search in Arabic stores
/search?q=تكنولوجيا&limit=50&country=sa&entity=podcast

# Search for authors
/search?q=joe+rogan&entity=podcastAuthor
```

## 🔧 Environment Variables

### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=itunes_podcasts_dev
DB_USER=postgres
DB_PASSWORD=postgres
DB_SYNCHRONIZE=false  # Use migrations instead (REQUIRED for production)
DB_MIGRATIONS_RUN=false  # Set to true to auto-run migrations on startup

# CORS
CORS_ORIGIN=http://localhost:3000

# iTunes API Rate Limiting (Optional - defaults provided)
ITUNES_API_RETRY_ATTEMPTS=3
ITUNES_API_RATE_LIMIT_RETRY_ATTEMPTS=5
ITUNES_API_RATE_LIMIT_BACKOFF_MULTIPLIER=2
ITUNES_API_CACHE_TTL=300000  # Cache TTL in milliseconds (300000ms = 5 minutes)
ITUNES_API_MAX_REQUESTS_PER_SECOND=20
```

See `backend/ITUNES_RATE_LIMITING.md` for detailed configuration options.

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

## 📡 API Endpoints

- `GET /api/v1/podcasts/search?term={term}&limit={limit}&country={country}&entity={entity}` - Search podcasts with pagination
- `GET /api/v1/podcasts?limit={limit}&offset={offset}` - Get all podcasts with pagination
- `GET /api/v1/podcasts/{id}` - Get podcast by ID
- `GET /api/v1/health` - Health check

### Pagination & Search Parameters

**Search Endpoint** supports the following parameters:
- `term` (required) - Search query
- `limit` (optional, 1-200, default: 20) - Number of results
- `country` (optional, default: 'us') - Country store (ISO 3166-1 alpha-2 code)
- `entity` (optional, default: 'podcast') - Entity type: `podcast` or `podcastAuthor`
- `offset` (optional, default: 0) - Client-side pagination offset

**Examples:**
```bash
# Basic search with 50 results
GET /api/v1/podcasts/search?term=javascript&limit=50

# Search in Canadian store
GET /api/v1/podcasts/search?term=hockey&country=ca&limit=100

# Search for podcast authors
GET /api/v1/podcasts/search?term=joe+rogan&entity=podcastAuthor

# Combined parameters
GET /api/v1/podcasts/search?term=technology&country=us&entity=podcast&limit=100
```

📖 **Documentation:**
- Quick Start: `backend/QUICK_START_PAGINATION.md`
- Full Guide: `backend/PAGINATION.md`
- Implementation Details: `IMPLEMENTATION_SUMMARY.md`
- Database Migrations: `backend/MIGRATIONS.md`
- Production Deployment: `backend/PRODUCTION-DEPLOYMENT.md`

⚠️ **Note:** iTunes Search API doesn't support offset-based pagination. Only the `limit` parameter affects iTunes results. Use `offset` for client-side filtering or database queries.

### Rate Limiting
The iTunes API integration includes comprehensive rate limit handling:
- Automatic detection of rate limit responses (302, 429, 503)
- Exponential backoff retry strategy
- Request caching to reduce API calls (5-minute TTL)
- Proactive request throttling (20 requests/second)

See `backend/ITUNES_RATE_LIMITING.md` for detailed documentation.

## 🎨 Error Handling

This application features a comprehensive error handling system with beautiful, animated error pages:

### Error Pages
- **404 Not Found** - Custom page with animated SVG and helpful navigation
- **500 Server Error** - Displays server errors with automatic error type detection
- **429 Rate Limit** - Special handling for rate limiting with helpful tips
- **Network Errors** - Graceful handling of connection issues
- **Global Error** - Last resort error boundary for critical failures

### Features
- **Custom SVG Illustrations** - Unique, hand-crafted SVG for each error type
- **CSS Animations** - Float, pulse, shake, and fade-in effects
- **Arabic Localization** - All error messages in Arabic
- **Error Type Detection** - Automatically detects and displays appropriate error UI
- **Retry Functionality** - Built-in retry buttons for recoverable errors
- **Developer Mode** - Technical details visible in development environment
- **Reusable Components** - ErrorDisplay component for inline error states

### Testing Errors
Visit the error test page to see all error states:
```
http://localhost:3000/test-errors
```

### Documentation
See `frontend/ERROR_HANDLING.md` for detailed documentation on:
- Error page components
- ErrorDisplay component usage
- Error utility functions
- API error handling
- Animation classes
- Best practices

## 🗄️ Database Management

This application uses TypeORM migrations for database schema management.

### Running Migrations

```bash
cd backend

# Run all pending migrations
npm run migration:run

# Show migration status
npm run migration:show

# Revert last migration
npm run migration:revert
```

### Production Deployment

⚠️ **IMPORTANT**: Never use `DB_SYNCHRONIZE=true` in production!

For production deployments:
1. Set `DB_SYNCHRONIZE=false` in environment variables
2. Run migrations manually before starting the application
3. Use the provided scripts for Docker deployments

See detailed guides:
- `backend/MIGRATIONS.md` - Complete migration documentation
- `backend/PRODUCTION-DEPLOYMENT.md` - Production deployment guide
- `how-to-start.md` - Step-by-step setup instructions

