# iTunes Podcast Search Application

A full-stack application that integrates with the iTunes Search API to search, store, and display podcast information. Built with NestJS (backend), Next.js (frontend), and PostgreSQL (database).

## ✨ Features

- **Podcast Search** - Search for podcasts using the iTunes Search API
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

## 🛠️ Tech Stack

**Backend:** NestJS, TypeORM, PostgreSQL, Axios  
**Frontend:** Next.js 14, TypeScript, Tailwind CSS, SWR, Radix UI, Lucide Icons

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
4. **View Details** - Click any podcast card to see more information

## 🔧 Environment Variables

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=itunes_podcasts_dev
DB_USER=postgres
DB_PASSWORD=postgres
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

## 📡 API Endpoints

- `GET /api/v1/podcasts/search?term={term}` - Search podcasts
- `GET /api/v1/podcasts` - Get all podcasts
- `GET /api/v1/podcasts/{id}` - Get podcast by ID
- `GET /api/v1/health` - Health check

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

