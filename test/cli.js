import { exec } from 'child_process';
import test from 'whim/lib/test';
import ygor from '../index';

test('cli', t => {
	t.plan(27);

	t.equal(typeof ygor.cli, 'object');

	process.chdir(__dirname);

	exec('node fixtures/make', (err, stdout, stderr) => {
		t.equal(err, null);
		t.equal(stdout, 'should run default task\n');
		t.equal(stderr, '');
	});

	exec('node fixtures/make test', (err, stdout, stderr) => {
		t.equal(err, null);
		t.equal(stdout, 'should run named task\n');
		t.equal(stderr, '');
	});

	exec('node fixtures/make throw', (err, stdout, stderr) => {
		t.equal(/should throw/.test(err), true);
		t.equal(stdout, '');
		t.equal(/should throw/.test(stderr), true);
	});

	exec('node fixtures/make error', (err, stdout, stderr) => {
		t.equal(err, null);
		t.equal(stdout, '');
		t.equal(/should not throw/.test(stderr), true);
	});

	exec('node fixtures/make parent childA', (err, stdout, stderr) => {
		t.equal(err, null);
		t.equal(stdout, 'should run sub task\n');
		t.equal(stderr, '');
	});

	exec('node fixtures/make ls', (err, stdout, stderr) => {
		t.equal(err, null);
		t.equal(stdout, 'default\nerror\nparent\ntest\nthrow\n');
		t.equal(stderr, '');
	});

	exec('node fixtures/make -v', (err, stdout, stderr) => {
		t.equal(err, null);
		t.equal(/\[make\] default\.\.\./.test(stdout), true);
		t.equal(/should run default task/.test(stdout), true);
		t.equal(stderr, '');
	});

	exec('node fixtures/make --verbose', (err, stdout, stderr) => {
		t.equal(err, null);
		t.equal(/\[make\] default\.\.\./.test(stdout), true);
		t.equal(/should run default task/.test(stdout), true);
		t.equal(stderr, '');
	});
});
