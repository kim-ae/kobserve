import { NodeSDK, } from '@opentelemetry/sdk-node';
import { CompressionAlgorithm } from '@opentelemetry/otlp-exporter-base';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { envDetector, processDetector } from '@opentelemetry/resources';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { diag, DiagConsoleLogger, DiagLogLevel, metrics } from '@opentelemetry/api';

// Load environment variables manually for OpenTelemetry
import * as dotenv from 'dotenv';
dotenv.config();

// Only initialize OpenTelemetry if enabled
if (process.env.ENABLE_OTEL === 'true') {
  // For troubleshooting, set the log level
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

  const sdk = new NodeSDK({
    traceExporter: new OTLPTraceExporter({
      headers: {},
      compression: CompressionAlgorithm.GZIP
    }),
    metricReader: new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({
        headers: {},
        compression: CompressionAlgorithm.GZIP,
      }),
    }),
    instrumentations: [getNodeAutoInstrumentations()],
    resourceDetectors: [envDetector, processDetector],
  });

  // Initialize the SDK
  try {
    sdk.start();
    console.log('OpenTelemetry SDK started successfully');
  } catch (error) {
    console.log('Error starting OpenTelemetry SDK:', error);
  }

  // Create meter for custom metrics
  const meter = metrics.getMeter(process.env.OTEL_SERVICE_NAME || 'product-service');
  const activeConnections = meter.createUpDownCounter('active_connections', {
    description: 'Number of active connections',
  });

  // Export for use in other parts of the application
  (global as any).otelMeter = meter;
  (global as any).otelActiveConnections = activeConnections;

  // Graceful shutdown
  process.on('SIGTERM', () => {
    try {
      sdk.shutdown();
      console.log('OpenTelemetry SDK terminated');
    } catch (error) {
      console.log('Error terminating OpenTelemetry SDK:', error);
    } finally {
      process.exit(0);
    }
  });
} else {
  console.log('OpenTelemetry disabled (ENABLE_OTEL not set to true)');
}
