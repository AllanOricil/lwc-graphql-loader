import * as path from 'path';
import * as winston from 'winston';

function createLogger(logFolderPath: string): winston.Logger {
  let fileLogFormat = winston.format.json();
  if (process.env.NODE_ENV === 'development') {
    fileLogFormat = winston.format.combine(
      winston.format.json(),
      winston.format.timestamp(),
      winston.format.prettyPrint()
    );
  }

  const logger = winston.createLogger({
    level: process.env.SFDX_LOG_LEVEL,
    format: fileLogFormat,
    transports: [
      new winston.transports.File({
        level: 'error',
        maxsize: 5242880,
        filename: path.resolve(logFolderPath, 'error.log'),
      }),
      new winston.transports.File({
        maxsize: 5242880,
        filename: path.resolve(logFolderPath, 'combined.log'),
      }),
    ],
  });

  const consoleLogFormat = winston.format.printf(
    ({ level, message, timestamp }) =>
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `${timestamp} [${level}]: ${JSON.stringify(message, null, 4)}`
  );

  if (process.env.NODE_ENV !== 'production') {
    logger.add(
      new winston.transports.Console({
        level: process.env.SFDX_LOG_LEVEL,
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          winston.format.colorize(),
          consoleLogFormat
        ),
      })
    );
  }

  return logger;
}

export { createLogger };
