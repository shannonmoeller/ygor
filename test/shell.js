import test from 'whim/lib/test';
import ygor from '../index';

test('shell', async t => {
	t.doesNotThrow(() => ygor.shell('date'));

	t.throws(() => ygor.shell(), /string/i);
	t.throws(() => ygor.shell('/dev/null/null'), /null/i);
});
