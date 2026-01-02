import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { database } from '../utils/database';
import { logger as lg } from '../utils/logger';

export async function healthRoutes(fastify: FastifyInstance) {
  const logger = fastify.log.child({ componenet: 'health' });
  // Health check endpoint
  fastify.get('/', async (request, reply) => {
    const startTime = Date.now();
    lg.info("blabla");
    logger.info({
      operation: 'healthCheck',
    }, 'Performing health check');

    try {
      const dbHealth = await database.healthCheck();
      const duration = Date.now() - startTime;
      
      const health = {
        status: dbHealth ? 'ok' : 'error',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        services: {
          database: {
            status: dbHealth ? 'up' : 'down',
          },
        },
      };

      const statusCode = dbHealth ? 200 : 503;
      
      if (dbHealth) {
        fastify.log.info({
          operation: 'healthCheck',
          status: 'healthy',
          duration,
        }, 'Health check passed');
      } else {
        fastify.log.warn({
          operation: 'healthCheck',
          status: 'unhealthy',
          duration,
        }, 'Health check failed - database down');
      }
      
      reply.status(statusCode).send(health);
    } catch (error) {
      const duration = Date.now() - startTime;
      fastify.log.error({
        operation: 'healthCheck',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
      }, 'Health check failed with exception');
      
      reply.status(503).send({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      });
    }
  });

  // Detailed health check
  fastify.get('/detailed', async (request, reply) => {
    const startTime = Date.now();
    fastify.log.info({
      operation: 'detailedHealthCheck',
    }, 'Performing detailed health check');

    try {
      const dbHealth = await database.healthCheck();
      const memoryUsage = process.memoryUsage();
      const duration = Date.now() - startTime;
      
      const detailedHealth = {
        status: dbHealth ? 'ok' : 'error',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: process.version,
        platform: process.platform,
        arch: process.arch,
        memory: {
          rss: memoryUsage.rss,
          heapTotal: memoryUsage.heapTotal,
          heapUsed: memoryUsage.heapUsed,
          external: memoryUsage.external,
        },
        services: {
          database: {
            status: dbHealth ? 'up' : 'down',
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '5432',
          },
        },
      };

      const statusCode = dbHealth ? 200 : 503;
      
      fastify.log.info({
        operation: 'detailedHealthCheck',
        status: dbHealth ? 'healthy' : 'unhealthy',
        memoryUsage: {
          rss: memoryUsage.rss,
          heapUsed: memoryUsage.heapUsed,
          heapTotal: memoryUsage.heapTotal,
        },
        uptime: process.uptime(),
        duration,
      }, 'Detailed health check completed');
      
      reply.status(statusCode).send(detailedHealth);
    } catch (error) {
      const duration = Date.now() - startTime;
      fastify.log.error({
        operation: 'detailedHealthCheck',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
      }, 'Detailed health check failed with exception');
      
      reply.status(503).send({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Detailed health check failed',
      });
    }
  });
}
