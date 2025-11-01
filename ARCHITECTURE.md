# System Architecture Documentation

## Overview

The iTunes Podcast Search application is a full-stack web application built using modern technologies and best practices. It follows a microservices-oriented architecture with clear separation of concerns.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│                     (Browser/Mobile App)                     │
└────────────────────────────┬────────────────────────────────┘
                             │
                             │ HTTPS
                             │
┌────────────────────────────▼────────────────────────────────┐
│                     Frontend (Next.js)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  - Server Components (SSR)                           │  │
│  │  - Client Components (Interactive UI)                │  │
│  │  - API Routes (BFF Pattern)                          │  │
│  │  - Static Assets                                     │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │
                             │ REST API (HTTP/JSON)
                             │
┌────────────────────────────▼────────────────────────────────┐
│                     Backend (NestJS)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Controller Layer                         │  │
│  │  - Request Validation                                 │  │
│  │  - Route Handling                                     │  │
│  │  - Response Formatting                                │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                      │
│  ┌────────────────────▼─────────────────────────────────┐  │
│  │              Service Layer                            │  │
│  │  - Business Logic                                     │  │
│  │  - Data Transformation                                │  │
│  │  - External API Integration                           │  │
│  └────────┬──────────────────────────┬──────────────────┘  │
│           │                          │                       │
│  ┌────────▼────────────┐   ┌────────▼──────────────────┐  │
│  │  iTunes API Service │   │  Podcast Repository        │  │
│  │  - HTTP Client      │   │  - Data Access Layer       │  │
│  │  - Error Handling   │   │  - Query Builder           │  │
│  └─────────────────────┘   └────────┬──────────────────┘  │
└─────────────────────────────────────┼──────────────────────┘
                                      │
                                      │ TypeORM
                                      │
┌─────────────────────────────────────▼──────────────────────┐
│                  Database (PostgreSQL)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Tables:                                             │  │
│  │  - podcasts                                          │  │
│  │  - Indexes for optimization                          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

External Services:
┌──────────────────────────┐
│   iTunes Search API      │
│   api.itunes.apple.com   │
└──────────────────────────┘
```

## Technology Stack

### Backend
- **Framework**: NestJS 10.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 16.x
- **ORM**: TypeORM 0.3.x
- **HTTP Client**: Axios
- **Validation**: class-validator, class-transformer
- **Security**: Helmet, CORS, Rate Limiting

### Frontend
- **Framework**: Next.js 14.x (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x
- **UI Components**: Radix UI
- **State Management**: SWR for server state
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Database**: PostgreSQL (containerized)

## Module Architecture

### Backend Modules

#### 1. Podcast Module (`src/modules/podcast`)
**Responsibility**: Core business logic for podcast management

**Components**:
- `PodcastController`: HTTP endpoints for podcast operations
- `PodcastService`: Business logic for podcast data
- `Podcast Entity`: Database schema definition
- `DTOs`: Data Transfer Objects for validation

**Key Methods**:
- `search(searchDto)`: Search podcasts via iTunes API
- `findAll(limit, offset)`: Retrieve all stored podcasts
- `findOne(id)`: Get single podcast by ID

#### 2. iTunes Module (`src/modules/itunes`)
**Responsibility**: Integration with iTunes Search API

**Components**:
- `ITunesService`: HTTP client for iTunes API
- Retry mechanism with exponential backoff
- Error handling and transformation

**Features**:
- Configurable timeout and retry
- Circuit breaker pattern
- Response caching strategy

#### 3. Database Module (`src/modules/database`)
**Responsibility**: Database connection and configuration

**Components**:
- TypeORM configuration
- Connection pooling
- Migration management

#### 4. Health Module (`src/modules/health`)
**Responsibility**: Application health monitoring

**Endpoints**:
- `/health`: Overall system health
- Checks: Database connectivity, iTunes API availability

### Frontend Structure

#### 1. App Directory (`src/app`)
**Next.js 14 App Router structure**

**Pages**:
- `/`: Homepage with introduction
- `/search`: Search interface
- `/podcast/[id]`: Podcast details page
- `/api/health`: Frontend health check

#### 2. Components (`src/components`)

**UI Components** (`src/components/ui`):
- Reusable Radix UI-based components
- Button, Card, Input, Badge, Alert, Skeleton

**Feature Components**:
- `search/SearchBar`: Debounced search input
- `podcast/PodcastCard`: Podcast display card
- `podcast/PodcastGrid`: Grid layout for podcasts
- `podcast/PodcastDetails`: Detailed podcast view

**Layout Components**:
- `layout/Header`: Application header
- `layout/Footer`: Application footer
- `layout/Container`: Responsive container

**Shared Components**:
- `shared/LoadingSpinner`: Loading indicator
- `shared/ErrorMessage`: Error display
- `shared/EmptyState`: Empty state UI

#### 3. Library (`src/lib`)

**API Client** (`src/lib/api`):
- `client.ts`: Axios configuration with interceptors
- `podcast.api.ts`: Podcast API methods

**Hooks** (`src/lib/hooks`):
- `usePodcastSearch`: SWR-based search hook
- `useDebounce`: Input debouncing

**Utils** (`src/lib/utils`):
- `cn`: Class name utility
- `format`: Date and text formatting
- `validators`: Zod validation schemas

## Data Flow

### Search Flow

```
1. User enters search term
   ↓
2. SearchBar component (debounced)
   ↓
3. usePodcastSearch hook
   ↓
4. API Client → Backend API
   ↓
5. PodcastController.search()
   ↓
6. PodcastService.search()
   ├─→ Check database cache
   └─→ ITunesService.searchPodcasts()
       ↓
       iTunes API
       ↓
7. Save/Update in PostgreSQL
   ↓
8. Return formatted response
   ↓
9. SWR cache + React state
   ↓
10. PodcastGrid renders results
```

### Detail View Flow

```
1. User clicks podcast card
   ↓
2. Navigate to /podcast/[id]
   ↓
3. Server-side data fetch (SSR)
   ↓
4. podcastApi.getById(id)
   ↓
5. Backend: PodcastController.findOne()
   ↓
6. PodcastService.findOne()
   ↓
7. Query PostgreSQL
   ↓
8. Return podcast data
   ↓
9. PodcastDetails component renders
```

## Database Schema

### Podcasts Table

```sql
CREATE TABLE podcasts (
    id SERIAL PRIMARY KEY,
    track_id BIGINT UNIQUE NOT NULL,
    track_name VARCHAR(500) NOT NULL,
    artist_name VARCHAR(255),
    collection_name VARCHAR(500),
    artwork_url_60 VARCHAR(1000),
    artwork_url_100 VARCHAR(1000),
    artwork_url_600 VARCHAR(1000),
    feed_url TEXT,
    track_view_url TEXT,
    release_date TIMESTAMP,
    country VARCHAR(2),
    primary_genre_name VARCHAR(100),
    genre_ids INTEGER[],
    genres VARCHAR(100)[],
    track_count INTEGER,
    track_explicit_content BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_podcasts_track_id ON podcasts(track_id);
CREATE INDEX idx_podcasts_track_name ON podcasts 
    USING gin(to_tsvector('english', track_name));
CREATE INDEX idx_podcasts_artist_name ON podcasts 
    USING gin(to_tsvector('english', artist_name));
CREATE INDEX idx_podcasts_genre ON podcasts(primary_genre_name);
CREATE INDEX idx_podcasts_created_at ON podcasts(created_at DESC);
```

## API Design

### REST API Endpoints

#### 1. Search Podcasts
```
GET /api/v1/podcasts/search

Query Parameters:
- term: string (required)
- limit: number (optional, default: 20)
- offset: number (optional, default: 0)
- country: string (optional, default: 'us')

Response: 200 OK
{
  "success": true,
  "data": {
    "podcasts": [...],
    "total": 100,
    "limit": 20,
    "offset": 0
  },
  "timestamp": "2025-11-01T10:00:00.000Z"
}
```

#### 2. Get All Podcasts
```
GET /api/v1/podcasts

Query Parameters:
- limit: number (optional)
- offset: number (optional)

Response: Same as search
```

#### 3. Get Podcast by ID
```
GET /api/v1/podcasts/:id

Response: 200 OK
{
  "success": true,
  "data": { ...podcast },
  "timestamp": "2025-11-01T10:00:00.000Z"
}
```

#### 4. Health Check
```
GET /api/v1/health

Response: 200 OK
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    "itunes": { "status": "up" }
  }
}
```

## Security Measures

### Backend Security

1. **Input Validation**
   - class-validator for DTO validation
   - Sanitization of user inputs
   - Type checking with TypeScript

2. **SQL Injection Prevention**
   - TypeORM parameterized queries
   - No raw SQL queries
   - Input sanitization

3. **Rate Limiting**
   - 100 requests per minute per IP
   - Configurable TTL and max requests
   - Throttler module from NestJS

4. **CORS Configuration**
   - Whitelist specific origins
   - Configurable via environment variables
   - Credentials support

5. **Security Headers**
   - Helmet.js integration
   - XSS protection
   - Content Security Policy
   - HSTS enabled in production

### Frontend Security

1. **XSS Prevention**
   - React's automatic escaping
   - No dangerouslySetInnerHTML usage
   - CSP headers

2. **API Key Protection**
   - No API keys in frontend code
   - Environment variables only
   - Backend proxy for external APIs

## Performance Optimizations

### Backend

1. **Database**
   - Connection pooling (min: 2, max: 10)
   - Indexed columns for fast queries
   - Efficient query patterns with TypeORM

2. **Caching**
   - Database acts as cache layer
   - Upsert pattern for updates
   - Future: Redis integration

3. **API Calls**
   - Retry mechanism with exponential backoff
   - Timeout configuration (10s)
   - Error handling and circuit breaker

### Frontend

1. **Data Fetching**
   - SWR for automatic caching
   - Stale-while-revalidate strategy
   - Request deduplication

2. **Rendering**
   - Server-side rendering for SEO
   - Client-side for interactivity
   - Skeleton screens for perceived performance

3. **Images**
   - Next.js Image component
   - Automatic optimization
   - Lazy loading
   - Responsive images

4. **Code Splitting**
   - Automatic with Next.js
   - Dynamic imports where needed
   - Optimized bundle sizes

## Monitoring and Logging

### Backend Logging

- **Structured Logging**: JSON format
- **Log Levels**: error, warn, info, debug, verbose
- **Request Logging**: All HTTP requests/responses
- **Error Tracking**: Detailed error logs with stack traces

### Health Checks

- **Database**: Connection status
- **iTunes API**: Availability check
- **Application**: Overall health status

## Deployment Architecture

### Docker Compose Development

```yaml
Services:
  - postgres:16-alpine (Port 5432)
  - backend (Port 8080)
  - frontend (Port 3000)

Networks:
  - itunes-network (bridge)

Volumes:
  - postgres_data_dev
  - backend_logs_dev
```

### Docker Compose Production

Same services with:
- Production builds
- Resource limits
- Health checks
- Non-root users
- SSL/TLS configuration

## Scalability Considerations

### Horizontal Scaling

1. **Backend**
   - Stateless design
   - Load balancer ready
   - Multiple instances support

2. **Frontend**
   - Static file CDN
   - Edge caching
   - Multiple instances

3. **Database**
   - Read replicas
   - Connection pooling
   - Partitioning strategy

### Vertical Scaling

- Resource limits configured
- CPU and memory allocation
- Database tuning parameters

## Future Enhancements

1. **Caching Layer**
   - Redis for API responses
   - Cache invalidation strategy

2. **Search Enhancements**
   - Elasticsearch integration
   - Advanced filtering
   - Faceted search

3. **User Features**
   - Authentication (JWT)
   - Favorites/Bookmarks
   - Search history

4. **Monitoring**
   - APM integration (New Relic, DataDog)
   - Error tracking (Sentry)
   - Analytics

5. **Testing**
   - E2E tests with Playwright
   - Load testing with k6
   - CI/CD pipeline

## Dependencies Graph

### Backend Dependencies
```
NestJS
├── @nestjs/core
├── @nestjs/common
├── @nestjs/platform-express
├── @nestjs/config
├── @nestjs/typeorm
├── @nestjs/throttler
├── @nestjs/terminus
├── TypeORM
│   └── pg
├── class-validator
├── class-transformer
├── axios
└── rxjs
```

### Frontend Dependencies
```
Next.js
├── React
├── React-DOM
├── @radix-ui/* (UI primitives)
├── Tailwind CSS
│   ├── autoprefixer
│   └── postcss
├── axios
├── swr
├── zod
├── date-fns
└── lucide-react
```

## Conclusion

This architecture provides a solid foundation for a scalable, maintainable, and performant podcast search application. The modular design allows for easy extension and modification, while the use of modern technologies ensures long-term viability and developer productivity.

