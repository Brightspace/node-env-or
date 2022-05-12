'use strict';

const EventEmitter = require('events');

const emitter = new EventEmitter();

const env = process.env;

class EnvironmentAccessedEvent {
	constructor(name, value, present, required) {
		this.name = name;
		this.value = value;
		this.present = present;
		this.required = required;
	}
}

module.exports = function envOr(name, or, requireInProd) {
	let val = env[name];

	const noOr = Boolean(requireInProd && 'production' === env.NODE_ENV);

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
			emitter.emit('access', new EnvironmentAccessedEvent(
				name,
				val,
				true,
				noOr
			));
			return val;
		}
	}

	if (noOr) {
		emitter.emit('access', new EnvironmentAccessedEvent(
			name,
			undefined,
			false,
			noOr
		));
		throw new Error(`Accessed environment "${name}", which was unavailable. Fallbacks are not allowed in production for this variable`);
	}

	if (undefined !== or) {
		emitter.emit('access', new EnvironmentAccessedEvent(
			name,
			or,
			false,
			noOr
		));
		return or;
	}

	emitter.emit('access', new EnvironmentAccessedEvent(
		name,
		undefined,
		false,
		noOr
	));
};

module.exports.requireInProd = function envNoOr(name, or) {
	return module.exports(name, or, true);
};

module.exports.on = emitter.on.bind(emitter);
module.exports.removeListener = emitter.removeListener.bind(emitter);
