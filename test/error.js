import test from 'whim/lib/test';
import ygor from '../index';

test('error', async t => {
	t.doesNotThrow(() => ygor.error());
});
