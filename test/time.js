import test from 'whim/lib/test';
import ygor from '../index';

test('time', async t => {
	const timeEnd = ygor.time('foo');

	t.doesNotThrow(() => timeEnd());
});
