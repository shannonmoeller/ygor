import test from 'ava';
import ygor from '../index';

test('error', t => {
	t.plan(1);

	t.notThrows(() => ygor.error());
});
