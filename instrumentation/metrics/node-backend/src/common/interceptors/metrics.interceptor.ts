import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from '@nestjs/common';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  private readonly logger = new Logger(MetricsInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const start = Date.now();

    this.logger.debug(`Starting request processing: ${request.method} ${request.url}`, 'METRICS');

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - start;
          const method = request.method;
          const route = request.route?.path || request.path;
          const statusCode = response.statusCode;

          this.logger.debug(`Request completed: ${method} ${route} - ${statusCode} (${duration}ms)`, 'METRICS');
        },
        error: (error) => {
          const duration = Date.now() - start;
          const method = request.method;
          const route = request.route?.path || request.path;
          const statusCode = error.status || 500;

          this.logger.error(`Request failed: ${method} ${route} - ${statusCode} (${duration}ms)`, error.stack, 'METRICS');
        },
      }),
    );
  }
}
