import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { register, collectDefaultMetrics, Counter, Histogram, Gauge } from 'prom-client';
import { productService } from '../services/product.service';
import { businessLogger } from '../utils/logger';

// Custom metrics
const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5],
});

const httpRequestTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

const activeConnections = new Counter({
  name: 'active_connections',
  help: 'Number of active connections',
});

// Collect default metrics
collectDefaultMetrics();

export async function metricsRoutes(fastify: FastifyInstance) {
  // Metrics endpoint for Prometheus
  fastify.get('/', async (request, reply) => {
    const startTime = Date.now();
    businessLogger.info({
      operation: 'getMetrics',
    }, 'Generating Prometheus metrics');

    try {
      // Add custom metrics
      const productCount = await productService.getProductCount();
      
      // Create a custom gauge for product count
      const productCountGauge = new Gauge({
        name: 'products_total',
        help: 'Total number of products',
      });
      productCountGauge.set(productCount);

      // Get metrics in Prometheus format
      const metrics = await register.metrics();
      const duration = Date.now() - startTime;
      
      businessLogger.info({
        operation: 'getMetrics',
        productCount,
        duration,
      }, 'Prometheus metrics generated successfully');
      
      reply.header('Content-Type', register.contentType);
      reply.send(metrics);
    } catch (error) {
      const duration = Date.now() - startTime;
      businessLogger.error({
        operation: 'getMetrics',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
      }, 'Failed to generate Prometheus metrics');
      
      reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // JSON metrics endpoint
  fastify.get('/json', async (request, reply) => {
    const startTime = Date.now();
    businessLogger.info({
      operation: 'getJsonMetrics',
    }, 'Generating JSON metrics');

    try {
      const metrics = await register.getMetricsAsJSON();
      const duration = Date.now() - startTime;
      
      businessLogger.info({
        operation: 'getJsonMetrics',
        metricCount: metrics.length,
        duration,
      }, 'JSON metrics generated successfully');
      
      reply.send(metrics);
    } catch (error) {
      const duration = Date.now() - startTime;
      businessLogger.error({
        operation: 'getJsonMetrics',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
      }, 'Failed to generate JSON metrics');
      
      reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Health check for metrics
  fastify.get('/health', async (request, reply) => {
    const startTime = Date.now();
    businessLogger.info({
      operation: 'metricsHealthCheck',
    }, 'Checking metrics health');

    try {
      const metrics = await register.metrics();
      const duration = Date.now() - startTime;
      
      businessLogger.info({
        operation: 'metricsHealthCheck',
        status: 'healthy',
        duration,
      }, 'Metrics health check passed');
      
      reply.send({ status: 'ok', metrics: 'available' });
    } catch (error) {
      const duration = Date.now() - startTime;
      businessLogger.error({
        operation: 'metricsHealthCheck',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
      }, 'Metrics health check failed');
      
      reply.status(503).send({ status: 'error', metrics: 'unavailable' });
    }
  });
}

// Export metrics for use in other parts of the application
export { httpRequestDuration, httpRequestTotal, activeConnections };
