import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import { config } from '../config/config';
import { dbLogger } from './logger';

class Database {
  private pool: Pool;

  constructor() {
    dbLogger.info({
      operation: 'databaseInit',
      host: config.database.host,
      port: config.database.port,
      database: config.database.database,
      maxConnections: 20,
    }, 'Initializing database connection pool');

    this.pool = new Pool({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
      database: config.database.database,
      ssl: config.database.ssl,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    this.pool.on('error', (err) => {
      dbLogger.fatal({
        operation: 'databaseError',
        error: err.message,
      }, 'Unexpected error on idle database client');
      process.exit(-1);
    });

    this.pool.on('connect', () => {
      dbLogger.debug({
        operation: 'databaseConnect',
      }, 'New database client connected');
    });

    this.pool.on('remove', () => {
      dbLogger.debug({
        operation: 'databaseRemove',
      }, 'Database client removed from pool');
    });
  }

  async getClient(): Promise<PoolClient> {
    const startTime = Date.now();
    try {
      const client = await this.pool.connect();
      const duration = Date.now() - startTime;
      
      dbLogger.debug({
        operation: 'getClient',
        duration,
      }, 'Database client acquired from pool');
      
      return client;
    } catch (error) {
      const duration = Date.now() - startTime;
      dbLogger.error({
        operation: 'getClient',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
      }, 'Failed to acquire database client from pool');
      throw error;
    }
  }

  async query<T extends QueryResultRow = any>(
    text: string, 
    params?: any[]
  ): Promise<{ rows: T[]; rowCount: number }> {
    const startTime = Date.now();
    const client = await this.getClient();
    
    try {
      const result = await client.query<T>(text, params);
      const duration = Date.now() - startTime;
      
      dbLogger.debug({
        operation: 'query',
        query: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        rowCount: result.rowCount || 0,
        duration,
      }, 'Database query executed successfully');
      
      return {
        rows: result.rows,
        rowCount: result.rowCount || 0
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      dbLogger.error({
        operation: 'query',
        query: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
      }, 'Database query failed');
      throw error;
    } finally {
      client.release();
    }
  }

  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const startTime = Date.now();
    const client = await this.getClient();
    
    dbLogger.info({
      operation: 'transaction',
    }, 'Starting database transaction');
    
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      const duration = Date.now() - startTime;
      
      dbLogger.info({
        operation: 'transaction',
        duration,
      }, 'Database transaction committed successfully');
      
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      const duration = Date.now() - startTime;
      
      dbLogger.error({
        operation: 'transaction',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
      }, 'Database transaction rolled back due to error');
      
      throw error;
    } finally {
      client.release();
    }
  }

  async close(): Promise<void> {
    dbLogger.info({
      operation: 'databaseClose',
    }, 'Closing database connection pool');
    
    try {
      await this.pool.end();
      dbLogger.info({
        operation: 'databaseClose',
      }, 'Database connection pool closed successfully');
    } catch (error) {
      dbLogger.error({
        operation: 'databaseClose',
        error: error instanceof Error ? error.message : 'Unknown error',
      }, 'Failed to close database connection pool');
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    const startTime = Date.now();
    dbLogger.debug({
      operation: 'healthCheck',
    }, 'Performing database health check');
    
    try {
      await this.query('SELECT 1');
      const duration = Date.now() - startTime;
      
      dbLogger.debug({
        operation: 'healthCheck',
        status: 'healthy',
        duration,
      }, 'Database health check passed');
      
      return true;
    } catch (error) {
      const duration = Date.now() - startTime;
      dbLogger.warn({
        operation: 'healthCheck',
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
      }, 'Database health check failed');
      
      return false;
    }
  }
}

export const database = new Database();
