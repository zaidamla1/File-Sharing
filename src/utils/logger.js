const winston = require('winston')
const {combine, timestamp, errors,json, colorize,simple} = winston.format;

const isProduction = process.env.NODE_ENV === 'production';

const logger = winston.createLogger({
    level : isProduction ? 'info': 'debug',
    format: combine(
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        errors ({stack: !isProduction}),
        json()
    ),
    transports : [
        new winston.transports.Console({
            format : isProduction ? combine(timestamp(),json()): combine(colorize(), simple())
        })
    ]
})
module.exports = logger;