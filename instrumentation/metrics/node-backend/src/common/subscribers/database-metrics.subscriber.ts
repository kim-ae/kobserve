import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DatabaseMetricsSubscriber {
  private readonly logger = new Logger(DatabaseMetricsSubscriber.name);
  constructor() {
    this.logger.log('Database metrics subscriber initialized', 'DatabaseMetricsSubscriber');
  }

  // Method to log database queries manually when called from services
  logQuery(query: string, duration: number, success: boolean, error?: string) {
    this.logger.log(query, duration, success, error);
    
    // Log slow queries
    if (duration > 1000) {
      this.logger.warn(`Slow query detected: ${query} (${duration}ms)`, 'DATABASE');
    }
  }

  // Method to log database errors
  logError(query: string, error: any) {
    this.logger.error(`Database query error: ${query}`, error.stack);
  }
}
