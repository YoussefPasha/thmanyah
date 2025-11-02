# iTunes Podcast Search Application

A full-stack application that integrates with the iTunes Search API to search, store, and display podcast information. Built with NestJS (backend), Next.js (frontend), and PostgreSQL (database).

## 📖 Table of Contents

- [What This Project Does](#-what-this-project-does)
- [How It Works](#️-how-it-works)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Quick Start](#-quick-start)
- [Usage](#-usage)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Rate Limiting & Job Queue](#rate-limiting--job-queue-details)
- [Error Handling](#-error-handling)
- [Database Management](#️-database-management)

## 📋 What This Project Does

This application allows users to:
- **Search podcasts** from the iTunes Search API across different countries and languages
- **Store podcast data** in a PostgreSQL database for persistent access
- **Browse saved podcasts** on the homepage without making external API calls
- **Filter searches** by country (US, Saudi Arabia, UAE, Egypt, UK, etc.), result limit (1-200), and entity type (podcasts or authors)
- **Share search URLs** with filters embedded in the URL for easy collaboration

### Key Technical Solutions

**🚦 iTunes API Rate Limiting Solution:**
The iTunes Search API has strict rate limits. We solved this with a three-pronged approach:
1. **Request Caching** - In-memory cache with 5-minute TTL to avoid duplicate API calls
2. **Request Throttling** - Proactive rate limiter allowing max 20 requests/second
3. **Exponential Backoff** - Automatic retry with increasing delays when rate limited (up to 5 attempts)

**⚙️ Job Queue System:**
To handle podcast data storage reliably without blocking API responses:
1. **Database-Backed Queue** - Podcast data is queued in a dedicated `podcast_jobs` table
2. **Cron Worker** - Background worker processes jobs every 10 seconds
3. **Retry Logic** - Failed jobs are retried up to 3 times automatically
4. **Parallel Processing** - Processes up to 10 jobs concurrently for efficiency
5. **Job Tracking** - Complete visibility into pending, processing, completed, and failed jobs

This architecture ensures fast API responses while reliably persisting data in the background.

## 🏗️ How It Works

### Application Flow

```
User Search → Frontend → Backend API → iTunes API
                              ↓
                         Job Queue (Database)
                              ↓
                    Background Worker (Cron)
                              ↓
                      PostgreSQL Database
```

**Step-by-step:**
1. **User searches** for a podcast on the frontend
2. **Frontend sends request** to the backend API
3. **Backend checks cache** - if found, returns immediately
4. **Backend calls iTunes API** with rate limiting protection
5. **API returns results instantly** to the user
6. **Podcast data is queued** in the `podcast_jobs` table
7. **Background worker picks up jobs** every 10 seconds
8. **Worker saves podcasts** to the database (with retries on failure)
9. **Homepage displays** all saved podcasts without external API calls

### Why This Architecture?

- ✅ **Fast Response Times** - API responds immediately without waiting for database operations
- ✅ **Reliable Data Storage** - Job queue ensures no data loss even if database is temporarily unavailable
- ✅ **Rate Limit Protection** - Caching and throttling prevent hitting iTunes API limits
- ✅ **Automatic Recovery** - Failed jobs are retried automatically up to 3 times
- ✅ **Scalable** - Background processing can handle large volumes without affecting API performance

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

## 🚀 Quick Start

### Prerequisites

Before running the application, ensure you have:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Docker & Docker Compose** (for containerized setup)
- **PostgreSQL** (v14 or higher, if running manually)

### Option 1: Using Docker (Recommended - Easiest Setup)

This is the fastest way to get started. Docker will automatically set up the database, backend, and frontend.

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd task2
   ```

2. **Start all services:**
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```
   
   This command will:
   - Create a PostgreSQL database
   - Run database migrations automatically
   - Start the NestJS backend on port 8080
   - Start the Next.js frontend on port 3000
   - Start the background job worker

3. **Access the application:**
   - **Frontend:** http://localhost:3000
   - **Backend API:** http://localhost:8080/api/v1
   - **Health Check:** http://localhost:8080/api/v1/health

4. **Stop services:**
   ```bash
   docker-compose -f docker-compose.dev.yml down
   ```

### Option 2: Manual Setup (For Development)

#### Step 1: Setup PostgreSQL Database

Create a PostgreSQL database:
```bash
# Using psql
createdb itunes_podcasts_dev

# Or using PostgreSQL shell
psql -U postgres
CREATE DATABASE itunes_podcasts_dev;
```

#### Step 2: Setup Backend

```bash
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env and set your database credentials

# Run database migrations
npm run migration:run

# Start the backend server
npm run start:dev     # Runs on http://localhost:8080
```

The backend will:
- Connect to PostgreSQL
- Start the REST API on port 8080
- Launch the background job worker (processes queue every 10 seconds)
- Enable rate limiting and caching for iTunes API calls

#### Step 3: Setup Frontend

```bash
cd frontend
npm install

# Configure API URL
echo "NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1" > .env.local

# Start the frontend server
npm run dev           # Runs on http://localhost:3000
```

#### Step 4: Verify Setup

1. Visit http://localhost:3000 to see the homepage
2. Try searching for a podcast (e.g., "javascript")
3. Check http://localhost:8080/api/v1/health to verify backend is running

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

### Rate Limiting & Job Queue Details

#### Rate Limiting Strategy

The iTunes Search API has strict but undocumented rate limits. Our solution implements three layers of protection:

**1. Request Caching (First Line of Defense)**
- In-memory cache stores iTunes API responses
- Default TTL: 5 minutes (300,000ms)
- Eliminates duplicate API calls for the same search
- Configurable via `ITUNES_API_CACHE_TTL` environment variable

**2. Request Throttling (Proactive Prevention)**
- Limits outgoing requests to 20 per second by default
- Prevents hitting rate limits before they occur
- Configurable via `ITUNES_API_MAX_REQUESTS_PER_SECOND`

**3. Exponential Backoff (Reactive Recovery)**
- Detects rate limit responses (HTTP 302, 429, 503)
- Retries with increasing delays: 1s → 2s → 4s → 8s → 16s
- Default: 5 retry attempts for rate limits, 3 for other errors
- Configurable via environment variables

#### Job Queue System

The background job queue ensures reliable data persistence:

**Database Table:** `podcast_jobs`
- Stores podcast data temporarily until processed
- Tracks job status: `pending`, `processing`, `completed`, `failed`
- Records attempt count and error messages

**Worker Process:**
- Runs on a cron schedule (every 10 seconds)
- Processes up to 10 jobs in parallel
- Prevents duplicate processing with status locking
- Automatically retries failed jobs (max 3 attempts)

**Benefits:**
- API responds in ~200-500ms (doesn't wait for database writes)
- Zero data loss even during database downtime
- Automatic recovery from transient failures
- Full visibility into processing status

See `backend/ITUNES_RATE_LIMITING.md` for detailed configuration options.

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