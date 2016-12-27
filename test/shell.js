import test from 'whim/lib/test';
import ygor from '../index';

test('shell pass', async t => {
	t.plan(1);

	return ygor
		.shell('date')
		.then(() => t.pass('yep'))
		.catch(() => t.fail('nope'));
});

test('shell fail', async t => {
	t.plan(1);

	return ygor
		.shell('/dev/null/null')
		.then(() => t.fail('nope'))
		.catch(() => t.pass('yep'));
});
