import { NodeSDK } from '@opentelemetry/sdk-node';
import { CompressionAlgorithm } from '@opentelemetry/otlp-exporter-base';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { envDetector, processDetector } from '@opentelemetry/resources';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { diag, DiagConsoleLogger, DiagLogLevel, metrics } from '@opentelemetry/api';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino';
import { JsonDiagConsoleLogger } from './utils/jsonDiagConsoleLogger';
// Import environment variables
import dotenv from 'dotenv';
dotenv.config();

// Only initialize OpenTelemetry if enabled
if (process.env.ENABLE_OTEL) {

  // For troubleshooting, set the log level
  diag.setLogger(new JsonDiagConsoleLogger(), DiagLogLevel.INFO);

  const sdk = new NodeSDK({
    instrumentations: [getNodeAutoInstrumentations(), new PinoInstrumentation()],
    resourceDetectors: [envDetector, processDetector],
  });
  sdk.start();
  diag.info('OpenTelemetry SDK started successfully');
  // Create meter for custom metrics
  const meter = metrics.getMeter(process.env.OTEL_SERVICE_NAME || 'fastify-product-service');
  const activeConnections = meter.createUpDownCounter('active_connections', {
    description: 'Number of active connections',
  });
}
