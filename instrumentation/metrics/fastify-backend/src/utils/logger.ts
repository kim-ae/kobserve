import pino from 'pino';

// Determine if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Create the base logger configuration
const loggerConfig: pino.LoggerOptions = {
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  timestamp: pino.stdTimeFunctions.isoTime,
  messageKey: 'message',
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  serializers: {
    req: (req) => ({
      body: req.log.level === 'info' ? req.body : undefined,
      method: req.method,
      url: req.url,
      headers: {
        host: req.headers.host,
        'user-agent': req.headers['user-agent'],
        'content-type': req.headers['content-type'],
        'content-length': req.headers['content-length'],
      },
    }),
    res: (res) => ({
      statusCode: res.statusCode,
      headers: {
        'content-type': res.getHeader('content-type'),
        'content-length': res.getHeader('content-length'),
      },
    }),
    err: pino.stdSerializers.err,
  },
  base: {
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
  },
};

// Add pretty printing for development
if (isDevelopment) {
  loggerConfig.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
      messageFormat: '[{service}] {msg}',
    },
  };
}

// Create the logger instance
export const logger = pino(loggerConfig);

// Create a child logger for HTTP requests
export const httpLogger = logger.child({ component: 'https' });

// Create a child logger for database operations
export const dbLogger = logger.child({ component: 'database' });

// Create a child logger for business logic
export const businessLogger = logger.child({ component: 'business' });

// Create a child logger for external services
export const externalLogger = logger.child({ component: 'external' });


// Helper function to create child loggers with context
export const createChildLogger = (context: Record<string, any>) => {
  return logger.child(context);
};

// Export the logger as default for Fastify
export default logger;
