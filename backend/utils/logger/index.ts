import * as winston from 'winston';

export function createLogger(name: string) {
  return winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { name },
    transports: [
      new winston.transports.Console()
    ]
  })
}