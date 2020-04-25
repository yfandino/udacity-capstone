import { createLogger, format, transports } from 'winston';

const customFormat = format( data => {
  if (data instanceof Error) {
    return Object.assign({
      message: data.message,
      error: data.stack
    }, data);
  }

  return data;
});

export function makeLogger(name: string) {
  return createLogger({
    level: 'info',
    format: format.combine(
      customFormat(),
      format.json()
    ),
    defaultMeta: { name },
    transports: [
      new transports.Console()
    ]
  })
}