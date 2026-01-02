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
export class HttpLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(HttpLoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const start = Date.now();

    const { method, url, headers, body, ip } = request;
    const userAgent = headers['user-agent'] || '';

    // Log incoming request
    this.logger.log(`Incoming ${method} request to ${url}`, 'HTTP');
    this.logger.debug(`Request details: ${JSON.stringify({ ip, userAgent, body })}`, 'HTTP');

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - start;
          const statusCode = response.statusCode;
          const httplog = {
            method, url, statusCode, duration, userAgent
          }
          // Log successful response
          this.logger.log(httplog);
          this.logger.debug(`Response sent: ${JSON.stringify(data)}`, 'HTTP');
        },
        error: (error) => {
          const duration = Date.now() - start;
          const statusCode = error.status || 500;

          // Log error response
          this.logger.error(
            `HTTP Error: ${method} ${url} - ${statusCode}`,
            error.stack,
            'HTTP',
          );
          const httplog = {
            method, url, statusCode, duration, userAgent
          }
          this.logger.log(httplog);
        },
      }),
    );
  }
}
