'use strict';

var test = require('whim/test');
var exec = require('child_process').exec;
var ygor = require('../index');

test('ygor', function (t) {
	process.chdir(__dirname);

	t.plan(29);

	t.equal(typeof ygor.cli, 'object');

	t.throws(function () {
		ygor.task();
	});

	t.throws(function () {
		ygor.task('foo');
	});

	exec('node make', function (err, stdout, stderr) {
		t.equal(err, null);
		t.equal(stdout, 'should run default task\n');
		t.equal(stderr, '');
	});

	exec('node make test', function (err, stdout, stderr) {
		t.equal(err, null);
		t.equal(stdout, 'should run named task\n');
		t.equal(stderr, '');
	});

	exec('node make throw', function (err, stdout, stderr) {
		t.equal(/should throw/.test(err), true);
		t.equal(stdout, '');
		t.equal(/should throw/.test(stderr), true);
	});

	exec('node make error', function (err, stdout, stderr) {
		t.equal(err, null);
		t.equal(stdout, '');
		t.equal(/should not throw/.test(stderr), true);
	});

	exec('node make parent childA', function (err, stdout, stderr) {
		t.equal(err, null);
		t.equal(stdout, 'should run sub task\n');
		t.equal(stderr, '');
	});

	exec('node make ls', function (err, stdout, stderr) {
		t.equal(err, null);
		t.equal(stdout, 'default\nerror\nparent\ntest\nthrow\n');
		t.equal(stderr, '');
	});

	exec('node make -v', function (err, stdout, stderr) {
		t.equal(err, null);
		t.equal(/\[make\] default\.\.\./.test(stdout), true);
		t.equal(/should run default task/.test(stdout), true);
		t.equal(stderr, '');
	});

	exec('node make --verbose', function (err, stdout, stderr) {
		t.equal(err, null);
		t.equal(/\[make\] default\.\.\./.test(stdout), true);
		t.equal(/should run default task/.test(stdout), true);
		t.equal(stderr, '');
	});
});
