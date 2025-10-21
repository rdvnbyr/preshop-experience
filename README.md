# 🏢 Places App - Full Stack Application

A modern full-stack application for managing places with professional logging infrastructure, built with Node.js/Express API and Next.js client.

## 🚀 Features

- **🔧 API Server** - Express.js backend with MongoDB integration
- **🎨 Client Dashboard** - Next.js React frontend with modern UI
- **📊 Professional Logging** - Custom Winston-based logging package with channels
- **🔄 Monorepo Setup** - Organized workspace with shared packages
- **🐳 Docker Support** - Containerized deployment ready
- **📱 Responsive Design** - Mobile-first admin dashboard

## 📁 Project Structure

```
exp-next/
├── 📦 packages/
│   └── logger/                 # Custom Winston logging package
├── 🔧 api/                     # Express.js API server
├── 🎨 client/                  # Next.js frontend
├── 📋 package.json             # Monorepo configuration
└── 📖 README.md               # This file
```

## 🛠️ Tech Stack

### Backend (API)

- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Database and ODM
- **Winston** - Professional logging
- **Sentry** - Error monitoring
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend (Client)

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Query** - Data fetching
- **Shopware API** - E-commerce integration

### Shared Packages

- **@exp-places-app/logger** - Custom logging infrastructure

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB instance
- Git

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd exp-next
```

2. **Install dependencies**

```bash
npm install
npm run install:all
```

3. **Environment Setup**

Create `.env` files in both `api/` and `client/` directories:

**API (.env):**

```env
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb://localhost:27017/places-app
JWT_SECRET=your-super-secret-jwt-key
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info
```

**Client (.env.local):**

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_ENV=development
```

4. **Start Development**

```bash
npm run dev
```

This will start:

- 🔧 **API Server** on `http://localhost:4000`
- 🎨 **Client App** on `http://localhost:3000`
- 📊 **Logger Package** in watch mode

## � Docker Deployment

For containerized deployment, you can use Docker Compose:

### Quick Docker Start

**Development Environment:**

```bash
# Start all services with hot reload
npm run docker:dev

# Or using the management script
./docker-manager.sh dev:start
```

**Production Environment:**

```bash
# Setup environment variables
cp .env.example .env
# Edit .env with your production values

# Start production services
npm run docker:prod

# Or using the management script
./docker-manager.sh prod:start
```

### Docker Services

| Service     | Port    | Description            |
| ----------- | ------- | ---------------------- |
| **nginx**   | 80, 443 | Reverse proxy with SSL |
| **client**  | 3000    | Next.js frontend       |
| **api**     | 4000    | Express.js backend     |
| **mongodb** | 27017   | MongoDB database       |

**Access Points:**

- **Development:**
  - Client: http://localhost:3000
  - API: http://localhost:4000
- **Production:**
  - Application: https://localhost (via Nginx)
  - Health checks: http://localhost:4000/health

### Docker Management Commands

```bash
# Development
npm run docker:dev              # Start dev environment
npm run docker:dev:stop         # Stop dev environment
npm run docker:dev:logs         # View dev logs
npm run docker:dev:rebuild      # Rebuild containers

# Production
npm run docker:prod             # Start prod environment
npm run docker:prod:stop        # Stop prod environment
npm run docker:prod:logs        # View prod logs

# Utilities
npm run docker:status           # Show container status
npm run docker:cleanup          # Clean up resources
npm run docker:backup           # Create database backup
```

**For detailed Docker documentation, see [DOCKER.md](./DOCKER.md)**

## �📜 Available Scripts

### Development

```bash
npm run dev              # Start all services
npm run dev:api          # Start API only (port 4000)
npm run dev:client       # Start Client only (port 3000)
npm run dev:logger       # Start Logger package in watch mode
```

### Production

```bash
npm run build            # Build all packages
npm run build:api        # Build API
npm run build:client     # Build Client
npm run build:logger     # Build Logger package
npm run start            # Start production servers
```

### Utilities

```bash
npm run install:all      # Install deps in all packages
npm run clean           # Clean all build artifacts
npm run test            # Run all tests
```

## 📊 Logging System

The application uses a custom Winston-based logging package with structured, channel-based logging.

### Available Log Channels

- **CHECKOUT** - Shopping cart and order processes
- **PRODUCT_CATALOG** - Product browsing and search
- **ACCOUNT** - User management and authentication
- **INTERSHOP_API** - External API integrations
- **STORYBLOK_CMS** - Content management system
- **SYSTEM** - General application logs

### Usage Examples

```javascript
const { checkoutLogger, accountLogger } = require("./lib/logger");

// Checkout operations
checkoutLogger.info("Order created successfully", {
  orderId: "ORD-123",
  userId: "user-456",
  total: 129.99,
  items: 3,
});

// Account operations
accountLogger.warn("Failed login attempt", {
  email: "user@example.com",
  ip: "192.168.1.100",
  reason: "Invalid password",
});
```

### Log Files

Logs are automatically written to:

- `./api/logs/YYYY-MM-DD-combined.log` - All application logs
- `./api/logs/YYYY-MM-DD-error.log` - Error logs only
- `./api/logs/exceptions.log` - Uncaught exceptions
- `./api/logs/rejections.log` - Unhandled promise rejections

## 🔧 API Endpoints

### Authentication

```
POST /api/auth/login     # User login
POST /api/auth/register  # User registration
POST /api/auth/refresh   # Refresh token
```

### Places

```
GET    /api/places       # Get all places
POST   /api/places       # Create new place
GET    /api/places/:id   # Get place by ID
PUT    /api/places/:id   # Update place
DELETE /api/places/:id   # Delete place
```

### Reviews

```
GET    /api/reviews      # Get all reviews
POST   /api/reviews      # Create review
PUT    /api/reviews/:id  # Update review
DELETE /api/reviews/:id  # Delete review
```

## 🎨 Client Features

- **📊 Dashboard** - Modern admin interface
- **📱 Responsive Design** - Mobile-first approach
- **🔍 Search & Filter** - Advanced place filtering
- **📈 Analytics** - Usage statistics and charts
- **🎯 Interactive Maps** - Place visualization
- **🔐 Authentication** - Secure user management

## 🐳 Docker Deployment

The API includes Docker support for easy deployment:

```bash
cd api
docker build -t places-api .
docker run -p 4000:4000 places-api
```

For full stack deployment with docker-compose:

```bash
docker-compose up -d
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcryptjs encryption
- **CORS Protection** - Configurable CORS policies
- **Input Validation** - express-validator middleware
- **Error Monitoring** - Sentry integration
- **Rate Limiting** - API request throttling

## 📈 Monitoring & Observability

- **Structured Logging** - Winston with custom channels
- **Error Tracking** - Sentry integration
- **Performance Monitoring** - Request timing and metrics
- **Health Checks** - API health endpoints
- **Log Rotation** - Daily rotating log files

## 🧪 Testing

```bash
npm run test             # Run all tests
npm run test:api         # Test API only
npm run test:client      # Test Client only
npm run test:logger      # Test Logger package
```

## 🤝 Development Workflow

1. **Feature Development**

   ```bash
   git checkout -b feature/new-feature
   npm run dev
   # Make changes
   npm run test
   git commit -m "Add new feature"
   git push origin feature/new-feature
   ```

2. **Logger Package Updates**

   ```bash
   cd packages/logger
   npm run dev  # Watch mode for changes
   # Edit logger files
   npm run build
   npm test
   ```

3. **API Integration**
   ```bash
   cd api
   npm run dev
   # API auto-restarts with nodemon
   # Use logger: const { systemLogger } = require('./lib/logger');
   ```

## 📚 Documentation

- [Docker Deployment Guide](./DOCKER.md) - Complete Docker setup and management
- [Logger Package Documentation](./packages/logger/README.md)
- [Logger Usage Examples](./packages/logger/EXAMPLES.md)
- [API Documentation](./api/README.md)
- [Places API Specification](./api/PLACES_API.md)

## 🔧 Configuration

### Logger Configuration

```javascript
setupLogger({
  level: "info", // Log level
  environment: "development", // Environment
  enableFileLogging: true, // Enable file output
  logDir: "./logs", // Log directory
  maxFiles: "14d", // Retention period
  maxSize: "20m", // Max file size
});
```

### API Configuration

Key environment variables:

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 4000)
- `MONGODB_URI` - Database connection string
- `JWT_SECRET` - JWT signing secret
- `LOG_LEVEL` - Logging level (error/warn/info/debug)

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**

```bash
lsof -ti:4000 | xargs kill -9  # Kill process on port 4000
lsof -ti:3000 | xargs kill -9  # Kill process on port 3000
```

**MongoDB connection issues:**

- Verify MongoDB is running
- Check connection string in `.env`
- Ensure network connectivity

**Logger not working:**

```bash
cd packages/logger
npm run build  # Rebuild logger package
```

**Missing dependencies:**

```bash
npm run install:all  # Reinstall all dependencies
```

### Docker Issues

**Docker containers won't start:**

```bash
# Check Docker status
docker --version
docker-compose --version

# View container logs
npm run docker:dev:logs
# or
./docker-manager.sh dev:logs

# Rebuild containers
npm run docker:dev:rebuild
```

**Port conflicts with Docker:**

```bash
# Check what's using Docker ports
lsof -i :3000 :4000 :27017 :80 :443

# Stop conflicting services
sudo systemctl stop nginx mongodb

# Clean up Docker resources
npm run docker:cleanup
```

**Database connection in Docker:**

```bash
# Check MongoDB container
docker exec -it places-app-mongodb-dev mongosh

# Verify container network
docker network inspect places-dev-network
```

**Out of disk space:**

```bash
# Clean up Docker system
docker system prune -af
docker volume prune -f

# Remove old images
docker image prune -af
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:

- Create an issue in the repository
- Check existing documentation
- Review log files for debugging

---

**Built with ❤️ by the Synaigy Team**
