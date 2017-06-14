import test from 'ava';
import ygor from '../index';

test('run known', t => {
	t.plan(2);

	const y = ygor();

	function foo() {
		t.pass('should run');
	}

	y.task('foo', foo);

	t.notThrows(() => y.run('foo'));
});

test('run unknown', t => {
	t.plan(1);

	const y = ygor();

	t.notThrows(() => y.run('foo'));
});
