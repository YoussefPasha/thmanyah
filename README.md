# iTunes Podcast Search Application

A full-stack application that integrates with the iTunes Search API to search, store, and display podcast information. Built with NestJS (backend), Next.js (frontend), and PostgreSQL (database).

## 🚀 Features

### Core Features
- **Podcast Search**: Search for podcasts using the iTunes Search API
- **Data Persistence**: Automatically saves search results to PostgreSQL
- **Browse Database**: View all podcasts stored in the database on the landing page
- **Real-time Search**: Debounced search with instant results
- **Detailed Views**: View comprehensive podcast information
- **Error Handling**: Graceful error handling throughout the application
- **Docker Support**: Fully containerized with Docker Compose

### UI/UX Features ✨ (Recently Enhanced)
- **Modern Landing Page**: Beautiful hero section with gradient effects and animations
- **Hero Search Box**: Large, prominent search box on homepage that redirects to search page
- **URL-Based Search**: Share search results via URL (`/search?q=keyword`)
- **Database Showcase**: Landing page displays podcasts from the database
- **Responsive Design**: Fully responsive across mobile, tablet, and desktop
- **Enhanced Navigation**: Active page indicators and smooth transitions
- **Loading States**: Skeleton loaders for better perceived performance
- **Empty States**: Helpful messages and call-to-actions when no data exists
- **Interactive Cards**: Hover effects and smooth animations on podcast cards
- **Statistics Display**: Real-time podcast count and stats on homepage

## 📋 Prerequisites

- **Node.js** 20.x or higher
- **Docker** and **Docker Compose**
- **npm** or **yarn**

## 🛠️ Technology Stack

### Backend
- **NestJS** - Node.js framework
- **TypeORM** - ORM for PostgreSQL
- **PostgreSQL** - Database
- **Axios** - HTTP client for iTunes API
- **Class Validator** - Input validation

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **SWR** - Data fetching
- **Radix UI** - Headless UI components
- **Lucide React** - Icons

## 📁 Project Structure

```
itunes-podcast-search/
├── backend/                 # NestJS backend application
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── modules/        # Feature modules
│   │   │   ├── podcast/    # Podcast module
│   │   │   ├── itunes/     # iTunes API service
│   │   │   ├── database/   # Database module
│   │   │   └── health/     # Health check
│   │   ├── common/         # Common utilities
│   │   └── utils/          # Helper functions
│   ├── Dockerfile.dev
│   └── Dockerfile.prod
├── frontend/               # Next.js frontend application
│   ├── src/
│   │   ├── app/           # Next.js app directory
│   │   ├── components/    # React components
│   │   ├── lib/           # Utilities and API clients
│   │   └── types/         # TypeScript types
│   ├── Dockerfile.dev
│   └── Dockerfile.prod
├── docker-compose.dev.yml
├── docker-compose.prod.yml
└── README.md
```

## 🚀 Quick Start

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   cd task2
   ```

2. **Start the development environment**
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000/api/v1
   - API Health Check: http://localhost:3000/api/v1/health

### Manual Setup

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start PostgreSQL** (if not using Docker)
   ```bash
   # Make sure PostgreSQL is running on port 5432
   ```

5. **Run the backend**
   ```bash
   npm run start:dev
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local file
   echo "NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1" > .env.local
   ```

4. **Run the frontend**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Backend Environment Variables

```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=itunes_podcasts_dev
DB_USER=postgres
DB_PASSWORD=postgres

# iTunes API
ITUNES_API_URL=https://itunes.apple.com
ITUNES_API_TIMEOUT=10000

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100

# CORS
CORS_ORIGIN=http://localhost:3001
```

### Frontend Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_APP_NAME=iTunes Podcast Search
```

## 📡 API Endpoints

### Search Podcasts
```
GET /api/v1/podcasts/search?term={searchTerm}&limit={limit}&offset={offset}
```

### Get All Podcasts
```
GET /api/v1/podcasts?limit={limit}&offset={offset}
```

### Get Podcast by ID
```
GET /api/v1/podcasts/{id}
```

### Health Check
```
GET /api/v1/health
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test              # Unit tests
npm run test:e2e         # E2E tests
npm run test:cov         # Coverage
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 🐳 Docker Commands

### Development

Start all services:
```bash
docker-compose -f docker-compose.dev.yml up
```

Start in detached mode:
```bash
docker-compose -f docker-compose.dev.yml up -d
```

Stop services:
```bash
docker-compose -f docker-compose.dev.yml down
```

View logs:
```bash
docker-compose -f docker-compose.dev.yml logs -f
```

### Production

Build and start:
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

## 🔍 Usage Examples

### Browsing Podcasts (New!)

1. Navigate to http://localhost:3001
2. View podcasts from the database on the homepage
3. See stats showing total podcasts available
4. Browse through the "Recent Podcasts" section
5. Click any podcast card to view details

### Search for Podcasts

**Option 1: From Homepage**
1. Navigate to http://localhost:3001
2. Type in the large search box in the hero section
3. Press Enter or click "Search" button
4. You'll be redirected to `/search?q=your-term` with results

**Option 2: From Search Page**
1. Navigate to http://localhost:3001/search
2. Or click "Search" in the navigation
3. Enter a search term (e.g., "fnjan", "tech", "business")
4. Results will appear automatically as you type
5. Click on any podcast card to view details

**Option 3: Direct URL**
- Access directly: http://localhost:3001/search?q=fnjan
- Great for bookmarking and sharing searches!

### API Usage

```bash
# Search for podcasts
curl "http://localhost:3000/api/v1/podcasts/search?term=fnjan"

# Get podcast by ID
curl "http://localhost:3000/api/v1/podcasts/1"

# Health check
curl "http://localhost:3000/api/v1/health"
```

## 🏗️ Architecture

The application follows a microservices architecture with:

- **Backend**: RESTful API built with NestJS
- **Frontend**: Server-side rendered React application with Next.js
- **Database**: PostgreSQL for data persistence
- **External API**: iTunes Search API for podcast data

### Data Flow

1. User searches for podcasts in the frontend
2. Frontend sends request to backend API
3. Backend queries iTunes Search API
4. Results are saved to PostgreSQL database
5. Backend returns formatted response to frontend
6. Frontend displays results in a responsive grid

## 🔐 Security Features

- Input validation with class-validator
- SQL injection prevention with parameterized queries
- XSS protection with Content Security Policy
- Rate limiting (100 requests per minute)
- CORS configuration
- Helmet.js security headers
- Non-root Docker containers

## 📊 Performance

- Database connection pooling
- API response caching
- Image optimization with Next.js Image component
- Debounced search input
- Lazy loading of components
- Efficient database queries with indexes

## 🐛 Troubleshooting

### Common Issues

**Port already in use**
```bash
# Check what's using the port
lsof -i :3000  # Backend
lsof -i :3001  # Frontend
lsof -i :5432  # PostgreSQL

# Kill the process
kill -9 <PID>
```

**Database connection error**
- Ensure PostgreSQL is running
- Check database credentials in .env file
- Verify database exists

**iTunes API timeout**
- Check your internet connection
- The iTunes API might be rate limiting
- Try again after a few minutes

## 📝 License

MIT License - see LICENSE file for details

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue on the GitHub repository.

## 📚 Additional Documentation

- **[FRONTEND_ENHANCEMENTS.md](./FRONTEND_ENHANCEMENTS.md)** - Detailed UI/UX improvements documentation
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and design decisions
- **[how-to-start.md](./how-to-start.md)** - Comprehensive setup guide with troubleshooting
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Project overview and summary

## 🎨 UI Screenshots

### Landing Page
- Modern hero section with gradient effects
- Large, prominent search box
- Recent podcasts grid from database
- Statistics and feature cards
- Responsive design across all devices

### Search Page
- URL-based search (`/search?q=keyword`)
- Real-time search results
- Empty and error states
- Pagination support (coming soon)

## 🙏 Acknowledgments

- iTunes Search API by Apple
- NestJS Framework
- Next.js Framework
- Tailwind CSS
- Radix UI Components
- Lucide Icons

