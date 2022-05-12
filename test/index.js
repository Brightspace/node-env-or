/* global afterEach, beforeEach, describe, it */

'use strict';

const
	chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon');

const envOr = require('../');

chai.use(require('sinon-chai'));

describe('envOr', function() {
	let listener;

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
		listener = sinon.stub();
		envOr.on('access', listener);
	});

	afterEach(function() {
		envOr.removeListener('access', listener);
	});

	describe('Accessing defined env', function() {
		describe('with a numeric default', function() {
			it('should give the value as number if it is parsable, and raise event', function() {
				setAs('456');
				expect(get(1)).to.be.a('number').and.to.equal(456);
				expect(listener).to.have.been.calledWithMatch({
					name: 'ENV_TEST_VAR',
					value: 456,
					present: true,
					required: false
				});
				listener.reset();

				setAs('-456');
				expect(get(1)).to.be.a('number').and.to.equal(-456);
				expect(listener).to.have.been.calledWithMatch({
					name: 'ENV_TEST_VAR',
					value: -456,
					present: true,
					required: false
				});
				listener.reset();

				setAs('1.5');
				expect(get(1)).to.be.a('number').and.to.equal(1.5);
				expect(listener).to.have.been.calledWithMatch({
					name: 'ENV_TEST_VAR',
					value: 1.5,
					present: true,
					required: false
				});
				listener.reset();
			});

			it('should give the default number if not parsable, and raise event', function() {
				setAs('foozles');
				expect(get(1)).to.be.a('number').and.to.equal(1);
				expect(listener).to.have.been.calledWithMatch({
					name: 'ENV_TEST_VAR',
					value: 1,
					present: false,
					required: false
				});
				listener.reset();

				setAs('0/0');
				expect(get(1)).to.be.a('number').and.to.equal(1);
				expect(listener).to.have.been.calledWithMatch({
					name: 'ENV_TEST_VAR',
					value: 1,
					present: false,
					required: false
				});
				listener.reset();
			});
		});

		describe('with a boolean default', function() {
			it('should give "true" as a boolean if it is truthy, and raise event', function() {
				setAs('true');
				expect(get(false)).to.be.a('boolean').and.to.equal(true);
				expect(listener).to.have.been.calledWithMatch({
					name: 'ENV_TEST_VAR',
					value: true,
					present: true,
					required: false
				});
				listener.reset();

				setAs('TRUE');
				expect(get(false)).to.be.a('boolean').and.to.equal(true);
				expect(listener).to.have.been.calledWithMatch({
					name: 'ENV_TEST_VAR',
					value: true,
					present: true,
					required: false
				});
				listener.reset();

				setAs('1');
				expect(get(false)).to.be.a('boolean').and.to.equal(true);
				expect(listener).to.have.been.calledWithMatch({
					name: 'ENV_TEST_VAR',
					value: true,
					present: true,
					required: false
				});
				listener.reset();
			});

			it('should give "false" as a boolean if it is not truthy, and raise event', function() {
				setAs('false');
				expect(get(true)).to.be.a('boolean').and.to.equal(false);
				expect(listener).to.have.been.calledWithMatch({
					name: 'ENV_TEST_VAR',
					value: false,
					present: true,
					required: false
				});
				listener.reset();

				setAs('FALSE');
				expect(get(true)).to.be.a('boolean').and.to.equal(false);
				expect(listener).to.have.been.calledWithMatch({
					name: 'ENV_TEST_VAR',
					value: false,
					present: true,
					required: false
				});
				listener.reset();

				setAs('0');
				expect(get(true)).to.be.a('boolean').and.to.equal(false);
				expect(listener).to.have.been.calledWithMatch({
					name: 'ENV_TEST_VAR',
					value: false,
					present: true,
					required: false
				});
				listener.reset();

				setAs('hi everyone!');
				expect(get(true)).to.be.a('boolean').and.to.equal(false);
				expect(listener).to.have.been.calledWithMatch({
					name: 'ENV_TEST_VAR',
					value: false,
					present: true,
					required: false
				});
				listener.reset();
			});
		});

		describe('with a string default', function() {
			it('should give value as a string, and raise event', function() {
				setAs('true');
				expect(get('foo')).to.be.a('string').and.to.equal('true');
				expect(listener).to.have.been.calledWithMatch({
					name: 'ENV_TEST_VAR',
					value: 'true',
					present: true,
					required: false
				});
				listener.reset();

				setAs('6');
				expect(get('foo')).to.be.a('string').and.to.equal('6');
				expect(listener).to.have.been.calledWithMatch({
					name: 'ENV_TEST_VAR',
					value: '6',
					present: true,
					required: false
				});
				listener.reset();

				setAs('hi everyone!');
				expect(get('foo')).to.be.a('string').and.to.equal('hi everyone!');
				expect(listener).to.have.been.calledWithMatch({
					name: 'ENV_TEST_VAR',
					value: 'hi everyone!',
					present: true,
					required: false
				});
				listener.reset();
			});
		});

		describe('with no default', function() {
			it('should give value as a string, and raise event', function() {
				setAs('true');
				expect(get()).to.be.a('string').and.to.equal('true');
				expect(listener).to.have.been.calledWithMatch({
					name: 'ENV_TEST_VAR',
					value: 'true',
					present: true,
					required: false
				});
				listener.reset();

				setAs('6');
				expect(get()).to.be.a('string').and.to.equal('6');
				expect(listener).to.have.been.calledWithMatch({
					name: 'ENV_TEST_VAR',
					value: '6',
					present: true,
					required: false
				});
				listener.reset();

				setAs('hi everyone!');
				expect(get()).to.be.a('string').and.to.equal('hi everyone!');
				expect(listener).to.have.been.calledWithMatch({
					name: 'ENV_TEST_VAR',
					value: 'hi everyone!',
					present: true,
					required: false
				});
				listener.reset();
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
					expect(listener).to.have.been.calledWithMatch({
						name: 'ENV_TEST_VAR',
						value: undefined,
						present: false,
						required: true
					});
				});
			});
		}

		describe('with a numeric default', function() {
			it('should give the default as anumber, and raise event', function() {
				setAs(undefined);
				expect(get(456)).to.be.a('number').and.to.equal(456);
				expect(listener).to.have.been.calledWithMatch({
					name: 'ENV_TEST_VAR',
					value: 456,
					present: false,
					required: false
				});
				listener.reset();

				setAs(undefined);
				expect(get(-456)).to.be.a('number').and.to.equal(-456);
				expect(listener).to.have.been.calledWithMatch({
					name: 'ENV_TEST_VAR',
					value: -456,
					present: false,
					required: false
				});
				listener.reset();

				setAs(undefined);
				expect(get(1.5)).to.be.a('number').and.to.equal(1.5);
				expect(listener).to.have.been.calledWithMatch({
					name: 'ENV_TEST_VAR',
					value: 1.5,
					present: false,
					required: false
				});
				listener.reset();
			});

			prodTest(456);
		});

		describe('with a boolean default', function() {
			it('should give default as a boolean, and raise event', function() {
				setAs(undefined);
				expect(get(true)).to.be.a('boolean').and.to.equal(true);
				expect(listener).to.have.been.calledWithMatch({
					name: 'ENV_TEST_VAR',
					value: true,
					present: false,
					required: false
				});
				listener.reset();

				setAs(undefined);
				expect(get(false)).to.be.a('boolean').and.to.equal(false);
				expect(listener).to.have.been.calledWithMatch({
					name: 'ENV_TEST_VAR',
					value: false,
					present: false,
					required: false
				});
				listener.reset();
			});

			prodTest(true);
		});

		describe('with a string default', function() {
			it('should give default as a string, and raise event', function() {
				setAs(undefined);
				expect(get('foo')).to.be.a('string').and.to.equal('foo');
				expect(listener).to.have.been.calledWithMatch({
					name: 'ENV_TEST_VAR',
					value: 'foo',
					present: false,
					required: false
				});
				listener.reset();
			});

			prodTest('foo');
		});

		describe('with no default', function() {
			it('should raise event', function() {
				setAs(undefined);
				expect(get()).to.equal(undefined);
				expect(listener).to.have.been.calledWithMatch({
					name: 'ENV_TEST_VAR',
					value: undefined,
					present: false,
					required: false
				});
				listener.reset();
			});

			prodTest(undefined);
		});
	});
});
