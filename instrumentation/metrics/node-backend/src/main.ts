// Import OpenTelemetry first (before NestJS)
import './otel';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, LogLevel, ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpLoggingInterceptor } from './common/interceptors/http-logging.interceptor';
import { MetricsInterceptor } from './common/interceptors/metrics.interceptor';

async function bootstrap() {
  // Configure logger based on environment
  const isDevelopment = process.env.NODE_ENV === 'development';
  const logger = new ConsoleLogger("product-service", {json: !isDevelopment})
  const logLevels: LogLevel[] = isDevelopment ? ['log', 'error', 'warn', 'debug', 'verbose'] : ['error'];
  
  const app = await NestFactory.create(AppModule, {
    logger: logger,
  });
  
  // Enable CORS
  app.enableCors();
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // Global interceptors (only in development)
  if (isDevelopment) {
    const httpLoggingInterceptor = app.get(HttpLoggingInterceptor);
    const metricsInterceptor = app.get(MetricsInterceptor);
    app.useGlobalInterceptors(httpLoggingInterceptor, metricsInterceptor);
  }

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  
  await app.listen(port);
  // Log startup information
  if (isDevelopment) {
    logger.log(`Application is running on: http://localhost:${port}`, 'Bootstrap');
    logger.log(`Environment: ${process.env.NODE_ENV || 'development'}`, 'Bootstrap');
    logger.log(`Log level: ${process.env.LOG_LEVEL || 'info'}`, 'Bootstrap');
  } else {
    logger.log(`Application is running on: http://localhost:${port}`, 'Bootstrap');
    logger.log(`Environment: ${process.env.NODE_ENV}`, 'Bootstrap');
  }
}

bootstrap();
