import test from 'whim/lib/test';
import ygor from '../index';

test('run', t => {
	t.plan(3);

	const y = ygor();

	function foo() {
		t.pass('should run');
	}

	setTimeout(() => {
		t.doesNotThrow(() => y.run('foo'));
	});

	setTimeout(() => {
		y.task('foo', foo);

		t.doesNotThrow(() => y.run('foo'));
	});
});
