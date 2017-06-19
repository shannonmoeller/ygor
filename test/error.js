import test from 'ava';
import ygor from '../index';

test('should fail gracefully', t => {
	t.plan(1);

	t.notThrows(() => ygor.error());
});
