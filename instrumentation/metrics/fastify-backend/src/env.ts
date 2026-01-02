import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

// Re-export environment variables with type safety
export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  HOST: process.env.HOST || '0.0.0.0',
  
  // Database
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  DB_NAME: process.env.DB_NAME || 'product_service',
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
  DB_SSL: process.env.DB_SSL === 'true',
  
  // OpenTelemetry
  ENABLE_OTEL: process.env.ENABLE_OTEL === 'true',
  OTEL_SERVICE_NAME: process.env.OTEL_SERVICE_NAME || 'fastify-product-service',
  OTEL_EXPORTER_OTLP_ENDPOINT: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318',
  
  // Rate Limiting
  RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX, 10) : 100,
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS ? parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) : 900000,
} as const;
