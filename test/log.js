/* global describe, it, beforeEach, afterEach */

'use strict';

const
	chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon'),
	util = require('util'),
	winston = require('winston');

const
	envOr = require('../');

describe('envOr logging', function () {
	let sandbox;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
	});

	afterEach(function () {
		sandbox.restore();
	});

	it('should be able to have a logger added', function () {
		const CustomLogger = winston.transports.CustomLogger = function () {
			this.name = 'customLogger';
			this.level = 'info';
		};
		util.inherits(CustomLogger, winston.Transport);
		CustomLogger.prototype.log = function (level, msg, meta, cb) {
			console.info(msg);
			cb(null, true);
		};

		sandbox.spy(console, 'info');
		envOr.logger.add(CustomLogger);
		envOr('ENV_TEST_VAR', 1);
		expect(console.info).to.have.been.called;
	});

	it('should be able to have a logger removed', function () {
		sandbox.spy(console, 'warn');
		envOr.logger.remove(winston.transports.Console);
		envOr('ENV_TEST_VAR', 1);
		expect(console.warn).to.have.not.been.called;
	});
});
