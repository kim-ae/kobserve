import { env } from '../env';

export interface Config {
  env: string;
  port: number;
  host: string;
  database: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    ssl: boolean;
  };
  rateLimit: {
    max: number;
    windowMs: number;
  };
  otel: {
    enabled: boolean;
    serviceName: string;
    endpoint: string;
  };
}

export const config: Config = {
  env: env.NODE_ENV,
  port: env.PORT,
  host: env.HOST,
  database: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    ssl: env.DB_SSL,
  },
  rateLimit: {
    max: env.RATE_LIMIT_MAX,
    windowMs: env.RATE_LIMIT_WINDOW_MS,
  },
  otel: {
    enabled: env.ENABLE_OTEL,
    serviceName: env.OTEL_SERVICE_NAME,
    endpoint: env.OTEL_EXPORTER_OTLP_ENDPOINT,
  },
};
