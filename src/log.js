'use strict';

const winston = require('winston');

const logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)({ timestamp: true })
	]
});

logger.level = process.env.LOG_LEVEL || 'info';

module.exports = logger;
