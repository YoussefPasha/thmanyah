# How to Start the iTunes Podcast Search Application

This guide provides step-by-step instructions for running the application in development mode.

## Prerequisites

Before starting, ensure you have the following installed:

- **Docker Desktop**: [Download here](https://www.docker.com/products/docker-desktop/)
- **Docker Compose**: Usually included with Docker Desktop
- **Git**: For cloning the repository (if needed)

## Option 1: Using Docker (Recommended) 🐳

This is the easiest way to get started. Docker will handle all dependencies and setup automatically.

### Step 1: Navigate to Project Directory

```bash
cd /Users/youssefpasha/Documents/tasks/task2
```

### Step 2: Start All Services

```bash
docker-compose -f docker-compose.dev.yml up --build
```

This command will:
- Build the Docker images for backend and frontend
- Start PostgreSQL database
- Start the NestJS backend on port 8080
- Start the Next.js frontend on port 3000
- Set up all networking between services

### Step 3: Wait for Services to Start

You'll see logs from all three services. Wait until you see:
- `🚀 Application is running on: http://localhost:8080/api/v1` (Backend)
- `✓ Ready in Xms` (Frontend)
- `database system is ready to accept connections` (PostgreSQL)

### Step 4: Access the Application

- **Frontend**: Open http://localhost:3000 in your browser
- **Backend API**: http://localhost:8080/api/v1
- **API Documentation**: http://localhost:8080/api/v1/podcasts/search?term=test

### Step 5: Stop the Application

Press `Ctrl+C` in the terminal, then run:

```bash
docker-compose -f docker-compose.dev.yml down
```

To also remove volumes (database data):
```bash
docker-compose -f docker-compose.dev.yml down -v
```

## Option 2: Manual Setup (Without Docker)

If you prefer to run services individually or don't want to use Docker.

### Prerequisites for Manual Setup

- **Node.js** 20.x or higher: [Download here](https://nodejs.org/)
- **PostgreSQL** 16.x: [Download here](https://www.postgresql.org/download/)
- **npm** (comes with Node.js)

### Step 1: Set Up PostgreSQL

1. **Install PostgreSQL** if not already installed

2. **Create Database**
   ```bash
   psql -U postgres
   CREATE DATABASE itunes_podcasts_dev;
   \q
   ```

3. **Verify Database**
   ```bash
   psql -U postgres -d itunes_podcasts_dev -c "\dt"
   ```

### Step 2: Set Up Backend

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Update .env file** (if needed)
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=itunes_podcasts_dev
   DB_USER=postgres
   DB_PASSWORD=postgres
   CORS_ORIGIN=http://localhost:3000
   ```

5. **Start the backend**
   ```bash
   npm run start:dev
   ```

   You should see: `🚀 Application is running on: http://localhost:8080/api/v1`

### Step 3: Set Up Frontend

1. **Open a new terminal** and navigate to frontend directory
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env.local file**
   ```bash
   echo "NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1" > .env.local
   ```

4. **Start the frontend**
   ```bash
   npm run dev
   ```

   You should see: `✓ Ready in Xms` and `Local: http://localhost:3000`

### Step 4: Access the Application

Open your browser and go to: http://localhost:3000

## Verifying the Installation

### 1. Check Backend Health

Visit: http://localhost:8080/api/v1/health

You should see:
```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    "itunes": { "status": "up" }
  }
}
```

### 2. Test Search Functionality

Visit: http://localhost:8080/api/v1/podcasts/search?term=fnjan

You should see a JSON response with podcast data.

### 3. Check Frontend

1. Go to http://localhost:3000
2. You should see the homepage with "Discover Amazing Podcasts"
3. Click "Start Searching"
4. Enter a search term like "fnjan" or "tech"
5. Results should appear automatically

## Common Issues & Solutions

### Issue: Port Already in Use

**Error**: `Port 3000 is already in use` or `Port 3000 is already in use`

**Solution**:
```bash
# Find what's using the port (macOS/Linux)
lsof -i :3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Issue: Docker Build Fails

**Error**: `ERROR [internal] load metadata for docker.io/library/node:20-alpine`

**Solution**:
```bash
# Pull the base image first
docker pull node:20-alpine

# Try building again
docker-compose -f docker-compose.dev.yml up --build
```

### Issue: Database Connection Failed

**Error**: `Unable to connect to the database`

**Solution for Docker**:
```bash
# Restart the services
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up
```

**Solution for Manual Setup**:
- Verify PostgreSQL is running: `pg_isready`
- Check credentials in `.env` file
- Ensure database exists: `psql -U postgres -l | grep itunes`

### Issue: Frontend Can't Connect to Backend

**Error**: Network Error or API calls failing

**Solution**:
- Verify backend is running: curl http://localhost:8080/api/v1/health
- Check CORS settings in backend `.env`: `CORS_ORIGIN=http://localhost:3000`
- Check frontend `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1`

### Issue: npm install fails

**Error**: `npm ERR! code ERESOLVE`

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Install again
npm install
```

## Development Tips

### Hot Reload

Both backend and frontend support hot reload:
- **Backend**: Changes to TypeScript files will automatically restart the server
- **Frontend**: Changes to React components will update in the browser instantly

### View Logs

**With Docker**:
```bash
# All services
docker-compose -f docker-compose.dev.yml logs -f

# Specific service
docker-compose -f docker-compose.dev.yml logs -f backend
docker-compose -f docker-compose.dev.yml logs -f frontend
```

**Without Docker**:
- Logs appear in the terminal where you started each service

### Database Access

**With Docker**:
```bash
docker-compose -f docker-compose.dev.yml exec postgres psql -U postgres -d itunes_podcasts_dev
```

**Without Docker**:
```bash
psql -U postgres -d itunes_podcasts_dev
```

Useful commands:
```sql
-- List tables
\dt

-- View podcasts
SELECT * FROM podcasts LIMIT 10;

-- Count podcasts
SELECT COUNT(*) FROM podcasts;
```

## Next Steps

After successfully starting the application:

1. **Try searching** for different podcast terms
2. **Explore the API** at http://localhost:8080/api/v1
3. **View database** to see stored podcasts
4. **Modify code** and see hot reload in action
5. **Check the ARCHITECTURE.md** for detailed system design

## Getting Help

If you encounter issues not covered here:

1. Check the main README.md file
2. Look at the error logs carefully
3. Ensure all prerequisites are properly installed
4. Try the Docker approach if manual setup fails
5. Check that no other applications are using the required ports

## Quick Command Reference

```bash
# Start with Docker (recommended)
docker-compose -f docker-compose.dev.yml up --build

# Start without Docker
# Terminal 1: Backend
cd backend && npm install && npm run start:dev

# Terminal 2: Frontend
cd frontend && npm install && npm run dev

# Stop Docker services
docker-compose -f docker-compose.dev.yml down

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Access database
docker-compose -f docker-compose.dev.yml exec postgres psql -U postgres -d itunes_podcasts_dev
```

Happy coding! 🚀

