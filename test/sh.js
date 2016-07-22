import test from 'whim/lib/test';
import ygor from '../index';

test('sh', async t => {
	t.doesNotThrow(() => ygor.sh('date'));

	t.throws(() => ygor.sh(), /string/i);
	t.throws(() => ygor.sh('/dev/null/null'), /null/i);
});
