import test from 'ava';
import ygor from '../index';

test('should throw on invalid input', t => {
	t.plan(2);

	t.throws(() => ygor.task(), /string/i);
	t.throws(() => ygor.task('foo'), /function/i);
});
