import { Controller, Get, Logger } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    this.logger.log('Health check requested', 'HealthController');
    
    try {
      const result = await this.health.check([
        () => this.db.pingCheck('database'),
      ]);
      
      this.logger.log('Health check completed successfully', 'HealthController');
      return result;
    } catch (error) {
      this.logger.error('Health check failed', error.stack, 'HealthController');
      throw error;
    }
  }
}
