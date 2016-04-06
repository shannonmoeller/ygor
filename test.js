'use strict';

var assert = require('assert');
var exec = require('child_process').exec;
var ygor = require('./index');

assert.equal(typeof ygor.cli, 'object');

assert.throws(function () {
	ygor.task();
});

assert.throws(function () {
	ygor.task('foo');
});

exec('node make', function (err, stdout, stderr) {
	assert.equal(err, null);
	assert.equal(stdout, 'should run default task\n');
	assert.equal(stderr, '');
});

exec('node make test', function (err, stdout, stderr) {
	assert.equal(err, null);
	assert.equal(stdout, 'should run named task\n');
	assert.equal(stderr, '');
});

exec('node make throw', function (err, stdout, stderr) {
	assert.ok(/should throw/.test(err));
	assert.equal(stdout, '');
	assert.ok(/should throw/.test(stderr));
});

exec('node make error', function (err, stdout, stderr) {
	assert.equal(err, null);
	assert.equal(stdout, '');
	assert.ok(/should not throw/.test(stderr));
});

exec('node make ls', function (err, stdout, stderr) {
	assert.equal(err, null);
	assert.equal(stdout, 'default\nerror\ntest\nthrow\n');
	assert.equal(stderr, '');
});

exec('node make -v', function (err, stdout, stderr) {
	assert.equal(err, null);
	assert.ok(/\[make\] default\.\.\./.test(stdout));
	assert.ok(/should run default task/.test(stdout));
	assert.equal(stderr, '');
});

exec('node make --verbose', function (err, stdout, stderr) {
	assert.equal(err, null);
	assert.ok(/\[make\] default\.\.\./.test(stdout));
	assert.ok(/should run default task/.test(stdout));
	assert.equal(stderr, '');
});
