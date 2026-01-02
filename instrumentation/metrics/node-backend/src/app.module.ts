import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';
import { ProductsModule } from './products/products.module';
import { HealthModule } from './health/health.module';
import { DatabaseConfig } from './config/database.config';
import { DatabaseMetricsSubscriber } from './common/subscribers/database-metrics.subscriber';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    TerminusModule,
    ProductsModule,
    HealthModule,
  ],
  providers: [DatabaseMetricsSubscriber],
})
export class AppModule {}
