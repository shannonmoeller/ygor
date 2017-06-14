import {exec} from 'child_process';
import test from 'ava';
import ygor from '../index';

test('is object', t => {
	t.plan(1);

	t.is(typeof ygor.cli, 'object');
});

test.cb('should run default task', t => {
	process.chdir(__dirname);
	t.plan(3);

	exec('node fixtures/make', (err, stdout, stderr) => {
		t.is(err, null);
		t.is(stdout, 'should run default task\n');
		t.is(stderr, '');
		t.end();
	});
});

test.cb('should run named task', t => {
	process.chdir(__dirname);
	t.plan(3);

	exec('node fixtures/make test', (err, stdout, stderr) => {
		t.is(err, null);
		t.is(stdout, 'should run named task\n');
		t.is(stderr, '');
		t.end();
	});
});

test.cb('should throw', t => {
	process.chdir(__dirname);
	t.plan(3);

	exec('node fixtures/make throw', (err, stdout, stderr) => {
		t.is(/should throw/.test(err), true);
		t.is(stdout, '');
		t.is(/should throw/.test(stderr), true);
		t.end();
	});
});

test.cb('should not throw', t => {
	process.chdir(__dirname);
	t.plan(3);

	exec('node fixtures/make error', (err, stdout, stderr) => {
		t.is(err, null);
		t.is(stdout, '');
		t.is(/should not throw/.test(stderr), true);
		t.end();
	});
});

test.cb('should run sub task', t => {
	process.chdir(__dirname);
	t.plan(3);

	exec('node fixtures/make parent childA', (err, stdout, stderr) => {
		t.is(err, null);
		t.is(stdout, 'should run sub task\n');
		t.is(stderr, '');
		t.end();
	});
});

test.cb('should list tasks', t => {
	process.chdir(__dirname);
	t.plan(3);

	exec('node fixtures/make ls', (err, stdout, stderr) => {
		t.is(err, null);
		t.is(stdout, 'default\nerror\nparent\ntest\nthrow\n');
		t.is(stderr, '');
		t.end();
	});
});

test.cb('should accept -v', t => {
	process.chdir(__dirname);
	t.plan(4);

	exec('node fixtures/make -v', (err, stdout, stderr) => {
		t.is(err, null);
		t.is(/\[make\] default\.\.\./.test(stdout), true);
		t.is(/should run default task/.test(stdout), true);
		t.is(stderr, '');
		t.end();
	});
});

test.cb('should accept --verbose', t => {
	process.chdir(__dirname);
	t.plan(4);

	exec('node fixtures/make --verbose', (err, stdout, stderr) => {
		t.is(err, null);
		t.is(/\[make\] default\.\.\./.test(stdout), true);
		t.is(/should run default task/.test(stdout), true);
		t.is(stderr, '');
		t.end();
	});
});
