import test from 'whim/lib/test';
import ygor from '../index';

test('task', async t => {
	t.throws(() => ygor.task(), /string/i);
	t.throws(() => ygor.task('foo'), /function/i);
});
