import { createLogger, format, transports } from 'winston'
import WinstonDailyRotateLogger from 'winston-daily-rotate-file'

export const logger = createLogger({
    format: format.combine(
        format.errors({ stack: true }),
        format.label({ label: 'BOT' }),
        format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }),
        format.printf((info) => {
            const { level, message } = info
            return `[${level}]: ${message}`
        })
    ),
    transports: [
        new transports.Console({
            level: 'info',
            format: format.colorize({ level: true })
        })
    ]
})

if (process.env.NODE_ENV === 'production') {
    logger.add(
        new WinstonDailyRotateLogger({
            level: 'debug',
            format: format.combine(format.timestamp(), format.json()),
            filename: 'logs/eve-%DATE%.log',
            maxFiles: '14d'
        })
    )
}
