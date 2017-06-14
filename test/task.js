import test from 'ava';
import ygor from '../index';

test('task', t => {
	t.plan(2);

	t.throws(() => ygor.task(), /string/i);
	t.throws(() => ygor.task('foo'), /function/i);
});
