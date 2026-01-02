# Product Service - NestJS

A NestJS-based product service with OpenTelemetry instrumentation, Prometheus metrics, and health checks.

## Features

- **NestJS Framework**: Modern, scalable Node.js framework
- **TypeORM**: Database ORM with PostgreSQL support
- **OpenTelemetry**: Distributed tracing and metrics
- **Prometheus**: Custom metrics collection using prom-client
- **Health Checks**: Application and database health monitoring
- **Validation**: Request validation using class-validator
- **CORS**: Cross-origin resource sharing enabled
- **Logging**: Built-in NestJS logger with environment-based configuration

## Project Structure

```
src/
├── common/
│   ├── interceptors/
│   │   └── metrics.interceptor.ts
│   └── subscribers/
│       └── database-metrics.subscriber.ts
├── config/
│   └── database.config.ts
├── health/
│   ├── health.controller.ts
│   └── health.module.ts
├── metrics/
│   ├── metrics.service.ts
│   ├── metrics.module.ts
│   └── prometheus.config.ts
├── products/
│   ├── dto/
│   │   ├── create-product.dto.ts
│   │   └── update-product.dto.ts
│   ├── entities/
│   │   └── product.entity.ts
│   ├── products.controller.ts
│   ├── products.service.ts
│   └── products.module.ts
├── tracing/
│   ├── tracing.service.ts
│   └── tracing.module.ts
├── app.module.ts
└── main.ts
```

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Environment
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=product_service
DB_SYNC=false
DB_LOGGING=false
DB_SSL=false

# Application
PORT=3000

# Logging
LOG_LEVEL=info

# OpenTelemetry
ENABLE_OTEL=true
OTEL_SERVICE_NAME=product-service
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

## Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

## API Endpoints

### Products
- `POST /products` - Create a new product
- `GET /products` - Get all products
- `GET /products/:id` - Get a specific product
- `PATCH /products/:id` - Update a product
- `DELETE /products/:id` - Delete a product

### Health & Metrics
- `GET /health` - Health check endpoint
- `GET /metrics` - Prometheus metrics endpoint

## Logging

The application uses NestJS built-in logger with environment-based configuration:

### Environment-Based Logging

#### Development Environment (`NODE_ENV=development`)
- **Full logging**: All log levels and categories
- **Console output**: Colored, formatted logs with timestamps
- **HTTP logging**: Request/response details
- **Database logging**: Query performance monitoring
- **Business events**: Product operations tracking

#### Production Environment (`NODE_ENV=production`)
- **Minimal logging**: Only errors and security events
- **Console output**: Clean, minimal format
- **No HTTP logging**: Performance optimization
- **No database logging**: Performance optimization

#### Test Environment (`NODE_ENV=test`)
- **Silent logging**: No logs generated
- **Performance**: Optimized for testing

### Log Levels
- **error**: Application errors and exceptions (all environments)
- **warn**: Warning messages and security events (dev + prod)
- **info**: General application information and business events (dev only)
- **debug**: Detailed debugging information (dev only)
- **verbose**: Very detailed debugging information (dev only)

### Log Output
- **Development**: Console output with timestamps and context
- **Production**: Console output for errors only
- **Test**: Silent logging for clean test output

### Log Categories
- **HTTP**: Request/response logging with timing (dev only)
- **DATABASE**: Database query logging with performance monitoring (dev only)
- **BUSINESS**: Business events (product creation, updates, etc.) (dev only)
- **SECURITY**: Security-related events (dev + prod)
- **PERFORMANCE**: Performance metrics (dev only)
- **METRICS**: Metrics collection events (dev only)

### Environment Variables
- `NODE_ENV`: Environment setting (development, production, test)
- `LOG_LEVEL`: Set logging level (default: info, dev only)

## Metrics

The application exposes the following custom metrics:

- `http_requests_total` - Total HTTP requests
- `http_request_duration_seconds` - HTTP request duration
- `db_query_total` - Total database queries
- `db_query_duration_seconds` - Database query duration
- `active_connections` - Number of active connections

## Tracing

OpenTelemetry tracing is automatically configured and will:
- Track HTTP requests
- Monitor database queries
- Provide distributed tracing capabilities

## Database Schema

The application expects a `products` table with the following structure:

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Docker

### Manual Docker Commands

Build and run development environment:
```bash
docker build -f Dockerfile.dev -t product-service:dev .
docker run -p 3000:3000 product-service:dev
```

Build and run production environment:
```bash
docker build -f Dockerfile -t product-service:prod .
docker run -p 3000:3000 product-service:prod
```

### Docker Compose

The project includes a complete development environment with:

- **NestJS Application** (development/production)
- **PostgreSQL Database**
- **Prometheus** (metrics collection)
- **Grafana** (metrics visualization)

Start the full stack:
```bash
# Development
docker-compose up app-dev postgres prometheus grafana

# Production
docker-compose up app-prod postgres prometheus grafana
```

### Docker Optimizations

The Dockerfile includes several optimizations:

- **Multi-stage builds** for smaller production images
- **Non-root user** for security
- **Proper signal handling** with dumb-init
- **Health checks** for container monitoring
- **Layer caching** optimization
- **Security hardening**

### Available Services

- **Application**: http://localhost:3000
- **Grafana**: http://localhost:3001 (admin/admin)
- **Prometheus**: http://localhost:9090
- **OpenTelemetry Collector**: http://localhost:4318 (OTLP HTTP)
- **PostgreSQL**: localhost:5432


## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
``` 