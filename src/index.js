'use strict';

const log = require('./log');

const env = process.env;

module.exports = function envOr (name, or, requireInProd) {
	let val = env[name];

	if ('undefined' !== val && undefined !== val && 'undefined' !== typeof val) {
		let useVal = false;

		switch (typeof or) {
			case 'number': {
				val = +val;
				useVal = !isNaN(val);
				break;
			}
			case 'boolean': {
				val = -1 !== [true, 'true', 'TRUE', '1', 1].indexOf(val);
				useVal = true;
				break;
			}
			default: {
				useVal = true;
			}
		}

		if (useVal) {
			log.info(`Accessed environment "${name}", got "${val}" (${typeof val})`);
			return val;
		}
	}

	const noOr = requireInProd && 'production' === env.NODE_ENV;
	if (noOr) {
		log.error(`Accessed environment "${name}", which was unavailable. Fallbacks are not allowed in production for this variable`);
		throw new Error(`Accessed environment "${name}", which was unavailable. Fallbacks are not allowed in production for this variable`);
	}

	if (undefined !== or) {
		log.warn(`Accessed environment "${name}", which was unavailable. "${or}" (${typeof or}) used instead.`);
		return or;
	}

	log.warn(`Accessed environment "${name}", which was unavailable. No fallback provided.`);
};

module.exports.logger = log;

module.exports.requireInProd = function envNoOr (name, or) {
	return module.exports(name, or, true);
};
