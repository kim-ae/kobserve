import { DiagLogger } from '@opentelemetry/api';

export class JsonDiagConsoleLogger implements DiagLogger {
    constructor() {
        this.debug('JsonDiagConsoleLogger constructor');
    }
    error(message: string, ...args: any[]): void {
        this.log('error', message, args );
    }
    warn(message: string, ...args: any[]): void {
        this.log('warn', message, args );
    }
    info(message: string, ...args: any[]): void {
        this.log('info', message, args );
    }
    debug(message: string, ...args: any[]): void {
        this.log('debug', message, args );
    }
    verbose(message: string, ...args: any[]): void {
        this.log('verbose', message, args );
    }
    private log(level: string, message: string, ...args: any[]): void {
        console.log(JSON.stringify({ time: new Date().toISOString(), level, message, data: args }));
    }
}
