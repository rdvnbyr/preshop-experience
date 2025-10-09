#!/bin/bash

# Places App Docker Management Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to create .env file if it doesn't exist
setup_env() {
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from .env.example..."
        if [ -f .env.example ]; then
            cp .env.example .env
            print_success ".env file created. Please update it with your values."
        else
            print_error ".env.example file not found!"
            exit 1
        fi
    fi
}

# Development commands
dev_start() {
    print_status "Starting development environment..."
    check_docker
    docker-compose -f docker-compose.dev.yml --env-file .env.dev up -d
    print_success "Development environment started!"
    print_status "Services available at:"
    echo "  - Client: http://localhost:3000"
    echo "  - API: http://localhost:4000"
    echo "  - MongoDB: localhost:27017"
}

dev_stop() {
    print_status "Stopping development environment..."
    docker-compose -f docker-compose.dev.yml down
    print_success "Development environment stopped!"
}

dev_logs() {
    docker-compose -f docker-compose.dev.yml logs -f "${2:-}"
}

dev_rebuild() {
    print_status "Rebuilding development environment..."
    docker-compose -f docker-compose.dev.yml down
    docker-compose -f docker-compose.dev.yml build --no-cache
    docker-compose -f docker-compose.dev.yml up -d
    print_success "Development environment rebuilt and started!"
}

# Production commands
prod_start() {
    print_status "Starting production environment..."
    check_docker
    setup_env
    docker-compose up -d
    print_success "Production environment started!"
    print_status "Services available at:"
    echo "  - Application: https://localhost (via Nginx)"
    echo "  - Direct Client: http://localhost:3000"
    echo "  - Direct API: http://localhost:4000"
}

prod_stop() {
    print_status "Stopping production environment..."
    docker-compose down
    print_success "Production environment stopped!"
}

prod_logs() {
    docker-compose logs -f "${2:-}"
}

prod_rebuild() {
    print_status "Rebuilding production environment..."
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d
    print_success "Production environment rebuilt and started!"
}

# Utility commands
status() {
    print_status "Container status:"
    docker ps --filter "name=places-app" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
}

cleanup() {
    print_status "Cleaning up Docker resources..."
    docker-compose down -v --remove-orphans
    docker-compose -f docker-compose.dev.yml down -v --remove-orphans
    docker system prune -f
    print_success "Cleanup completed!"
}

backup_db() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="backup_${timestamp}.archive"
    
    print_status "Creating database backup..."
    docker exec places-app-mongodb mongodump --archive=/tmp/${backup_file} --gzip
    docker cp places-app-mongodb:/tmp/${backup_file} ./backups/
    print_success "Database backup created: ./backups/${backup_file}"
}

restore_db() {
    local backup_file="$2"
    if [ -z "$backup_file" ]; then
        print_error "Please specify a backup file: ./docker-manager.sh restore <backup_file>"
        exit 1
    fi
    
    print_status "Restoring database from ${backup_file}..."
    docker cp "./backups/${backup_file}" places-app-mongodb:/tmp/
    docker exec places-app-mongodb mongorestore --archive=/tmp/${backup_file} --gzip --drop
    print_success "Database restored from ${backup_file}"
}

# Help function
show_help() {
    echo "Places App Docker Management Script"
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Development Commands:"
    echo "  dev:start     Start development environment"
    echo "  dev:stop      Stop development environment"
    echo "  dev:logs      Show development logs [service]"
    echo "  dev:rebuild   Rebuild and restart development environment"
    echo ""
    echo "Production Commands:"
    echo "  prod:start    Start production environment"
    echo "  prod:stop     Stop production environment"
    echo "  prod:logs     Show production logs [service]"
    echo "  prod:rebuild  Rebuild and restart production environment"
    echo ""
    echo "Utility Commands:"
    echo "  status        Show container status"
    echo "  cleanup       Clean up all Docker resources"
    echo "  backup        Create database backup"
    echo "  restore       Restore database from backup <backup_file>"
    echo "  help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev:start"
    echo "  $0 dev:logs api-dev"
    echo "  $0 prod:start"
    echo "  $0 backup"
    echo "  $0 restore backup_20231009_143022.archive"
}

# Main command router
case "${1:-}" in
    "dev:start")
        dev_start
        ;;
    "dev:stop")
        dev_stop
        ;;
    "dev:logs")
        dev_logs "$@"
        ;;
    "dev:rebuild")
        dev_rebuild
        ;;
    "prod:start")
        prod_start
        ;;
    "prod:stop")
        prod_stop
        ;;
    "prod:logs")
        prod_logs "$@"
        ;;
    "prod:rebuild")
        prod_rebuild
        ;;
    "status")
        status
        ;;
    "cleanup")
        cleanup
        ;;
    "backup")
        backup_db
        ;;
    "restore")
        restore_db "$@"
        ;;
    "help"|"--help"|"-h"|"")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac