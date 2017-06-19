import test from 'ava';
import ygor from '../index';

test('should run known task', t => {
	t.plan(2);

	const y = ygor();

	function foo() {
		t.pass('should run');
	}

	y.task('foo', foo);

	t.notThrows(() => y.run('foo'));
});

test('should list tasks given unknown', t => {
	t.plan(1);

	const y = ygor();

	t.notThrows(() => y.run('foo'));
});
