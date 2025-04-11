import { createLogger, format, transports } from 'winston';

const logger = createLogger({
	level: 'info',
	format: format.combine(
		format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		format.printf(({ level, message, timestamp })=>{
			return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
		})
	),
	transports:[
		new transports.Console({}),
		new transports.File({ filename: 'logs/app.log'})
	]
});

// stream for morgan
logger.stream = {
	write: (message)=>{
		logger.info(message.trim());
	}
}

export default logger;