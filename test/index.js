/* global afterEach, beforeEach, describe, it */

'use strict';

const
	chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon');

const
	envOr = require('../'),
	log = require('../src/log');

chai.use(require('sinon-chai'));

describe('envOr', function() {
	let sandbox;

	function setAs(val) {
		if (val !== undefined) {
			expect(val).to.be.a('string');
		}

		process.env.ENV_TEST_VAR = val;
	}

	function get(or) {
		return envOr('ENV_TEST_VAR', or);
	}

	get.requireInProd = function(or) {
		return envOr.requireInProd('ENV_TEST_VAR', or);
	};

	beforeEach(function() {
		sandbox = sinon.createSandbox();
		sandbox.stub(log, 'error');
		sandbox.stub(log, 'info');
		sandbox.stub(log, 'warn');
	});

	afterEach(function() {
		sandbox.restore();
		setAs(undefined);
	});

	describe('Accessing defined env', function() {
		describe('with a numeric default', function() {
			it('should give the value as number if it is parsable, and info log', function() {
				setAs('456');
				expect(get(1)).to.be.a('number').and.to.equal(456);
				expect(log.info).to.have.been.calledWithMatch('"456" (number)');
				log.info.reset();

				setAs('-456');
				expect(get(1)).to.be.a('number').and.to.equal(-456);
				expect(log.info).to.have.been.calledWithMatch('"-456" (number)');
				log.info.reset();

				setAs('1.5');
				expect(get(1)).to.be.a('number').and.to.equal(1.5);
				expect(log.info).to.have.been.calledWithMatch('"1.5" (number)');
				log.info.reset();
			});

			it('should give the default number if not parsable, and warn', function() {
				setAs('foozles');
				expect(get(1)).to.be.a('number').and.to.equal(1);
				expect(log.warn).to.have.been.calledWithMatch('"1" (number)');
				log.warn.reset();

				setAs('0/0');
				expect(get(1)).to.be.a('number').and.to.equal(1);
				expect(log.warn).to.have.been.calledWithMatch('"1" (number)');
				log.warn.reset();
			});
		});

		describe('with a boolean default', function() {
			it('should give "true" as a boolean if it is truthy, and info log', function() {
				setAs('true');
				expect(get(false)).to.be.a('boolean').and.to.equal(true);
				expect(log.info).to.have.been.calledWithMatch('"true" (boolean)');
				log.info.reset();

				setAs('TRUE');
				expect(get(false)).to.be.a('boolean').and.to.equal(true);
				expect(log.info).to.have.been.calledWithMatch('"true" (boolean)');
				log.info.reset();

				setAs('1');
				expect(get(false)).to.be.a('boolean').and.to.equal(true);
				expect(log.info).to.have.been.calledWithMatch('"true" (boolean)');
				log.info.reset();
			});

			it('should give "false" as a boolean if it is not truthy, and info log', function() {
				setAs('false');
				expect(get(true)).to.be.a('boolean').and.to.equal(false);
				expect(log.info).to.have.been.calledWithMatch('"false" (boolean)');
				log.info.reset();

				setAs('FALSE');
				expect(get(true)).to.be.a('boolean').and.to.equal(false);
				expect(log.info).to.have.been.calledWithMatch('"false" (boolean)');
				log.info.reset();

				setAs('0');
				expect(get(true)).to.be.a('boolean').and.to.equal(false);
				expect(log.info).to.have.been.calledWithMatch('"false" (boolean)');
				log.info.reset();

				setAs('hi everyone!');
				expect(get(true)).to.be.a('boolean').and.to.equal(false);
				expect(log.info).to.have.been.calledWithMatch('"false" (boolean)');
				log.info.reset();
			});
		});

		describe('with a string default', function() {
			it('should give value as a string, and info log', function() {
				setAs('true');
				expect(get('foo')).to.be.a('string').and.to.equal('true');
				expect(log.info).to.have.been.calledWithMatch('"true" (string)');
				log.info.reset();

				setAs('6');
				expect(get('foo')).to.be.a('string').and.to.equal('6');
				expect(log.info).to.have.been.calledWithMatch('"6" (string)');
				log.info.reset();

				setAs('hi everyone!');
				expect(get('foo')).to.be.a('string').and.to.equal('hi everyone!');
				expect(log.info).to.have.been.calledWithMatch('"hi everyone!" (string)');
				log.info.reset();
			});
		});

		describe('with no default', function() {
			it('should give value as a string, and info log', function() {
				setAs('true');
				expect(get()).to.be.a('string').and.to.equal('true');
				expect(log.info).to.have.been.calledWithMatch('"true" (string)');
				log.info.reset();

				setAs('6');
				expect(get()).to.be.a('string').and.to.equal('6');
				expect(log.info).to.have.been.calledWithMatch('"6" (string)');
				log.info.reset();

				setAs('hi everyone!');
				expect(get()).to.be.a('string').and.to.equal('hi everyone!');
				expect(log.info).to.have.been.calledWithMatch('"hi everyone!" (string)');
				log.info.reset();
			});
		});
	});

	describe('Accessing undefined env', function() {
		function prodTest(or) {
			describe('and required in prod', function() {
				let previous;

				beforeEach(function() {
					previous = process.env.NODE_ENV;
					process.env.NODE_ENV = 'production';
				});

				afterEach(function() {
					process.env.NODE_ENV = previous;
				});

				it('should exit the process', function() {
					setAs(undefined);
					expect(get.requireInProd.bind(undefined, or)).to.throw(/Fallbacks are not allowed/);
					expect(log.error).to.have.been.calledWithMatch('Fallbacks are not allowed');
				});
			});
		}

		describe('with a numeric default', function() {
			it('should give the default as anumber, and warn', function() {
				setAs(undefined);
				expect(get(456)).to.be.a('number').and.to.equal(456);
				expect(log.warn).to.have.been.calledWithMatch('"456" (number)');
				log.warn.reset();

				setAs(undefined);
				expect(get(-456)).to.be.a('number').and.to.equal(-456);
				expect(log.warn).to.have.been.calledWithMatch('"-456" (number)');
				log.warn.reset();

				setAs(undefined);
				expect(get(1.5)).to.be.a('number').and.to.equal(1.5);
				expect(log.warn).to.have.been.calledWithMatch('"1.5" (number)');
				log.warn.reset();
			});

			prodTest(456);
		});

		describe('with a boolean default', function() {
			it('should give default as a boolean, and warn', function() {
				setAs(undefined);
				expect(get(true)).to.be.a('boolean').and.to.equal(true);
				expect(log.warn).to.have.been.calledWithMatch('"true" (boolean)');
				log.warn.reset();

				setAs(undefined);
				expect(get(false)).to.be.a('boolean').and.to.equal(false);
				expect(log.warn).to.have.been.calledWithMatch('"false" (boolean)');
				log.warn.reset();
			});

			prodTest(true);
		});

		describe('with a string default', function() {
			it('should give default as a string, and warn', function() {
				setAs(undefined);
				expect(get('foo')).to.be.a('string').and.to.equal('foo');
				expect(log.warn).to.have.been.calledWithMatch('"foo" (string)');
				log.warn.reset();
			});

			prodTest('foo');
		});

		describe('with no default', function() {
			it('should warn', function() {
				setAs(undefined);
				expect(get()).to.equal(undefined);
				expect(log.warn).to.have.been.calledWithMatch('No fallback provided');
				log.warn.reset();
			});

			prodTest(undefined);
		});
	});
});
