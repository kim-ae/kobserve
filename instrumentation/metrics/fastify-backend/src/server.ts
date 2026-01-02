import './utils/jsonDiagConsoleLogger';
import './otel';

import 'dotenv/config';

import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import { productRoutes } from './routes/product.routes';
import { healthRoutes } from './routes/health.routes';
import { metricsRoutes } from './routes/metrics.routes';
import { config } from './config/config';
import { logger, httpLogger } from './utils/logger';

async function createServer(): Promise<FastifyInstance> {
  const server = Fastify({
    trustProxy: true,
    loggerInstance: httpLogger,
  });

  // Register plugins
  await server.register(cors, {
    origin: true,
    credentials: true,
  });

  await server.register(helmet, {
    contentSecurityPolicy: false,
  });

  await server.register(rateLimit, {
    max: config.rateLimit.max,
    timeWindow: config.rateLimit.windowMs,
  });

  // Swagger documentation
  await server.register(swagger, {
    swagger: {
      info: {
        title: 'Fastify Product Service API',
        description: 'Product service with Fastify, TypeScript, and OpenTelemetry',
        version: '1.0.0',
      },
      host: `${config.host}:${config.port}`,
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json'],
    },
  });

  await server.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
  });

  // Register routes
  await server.register(productRoutes, { prefix: '/products'});
  await server.register(healthRoutes, { prefix: '/health' });
  await server.register(metricsRoutes, { prefix: '/metrics' });

  // Root endpoint
  server.get('/', async (request, reply) => {
    logger.debug('Home route accessed');
    return {
      message: 'Fastify Product Service API',
      version: '1.0.0',
      environment: config.env,
      timestamp: new Date().toISOString(),
    };
  });

  server.get('/log-level', async (request, reply) => {
    return { currentLevel: logger.level };
  });
  server.post('/log-level', async (request, reply) => {
    const { level, component, route } = request.body as { level: string, component: string, route: string };
    logger.level = level;
    logger.child({ component, route }).level = level;
    return { message: `Log level changed to ${level}` };
  });

  return server;
}


async function start() {
  try {
    const server = await createServer();
    
    await server.listen({
      port: config.port,
      host: config.host,
    });

    logger.info({
      port: config.port,
      host: config.host,
      environment: config.env,
    }, 'Server started successfully');
  } catch (err) {
    logger.fatal({ err }, 'Failed to start server');
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

start();
