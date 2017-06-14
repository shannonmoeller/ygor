import test from 'ava';
import ygor from '../index';

test('shell pass', async t => {
	t.plan(1);

	await ygor
		.shell('echo bar')
		.then(() => t.pass('yep'))
		.catch(() => t.fail('nope'));
});

test('shell fail', async t => {
	t.plan(1);

	await ygor
		.shell('/dev/null/null')
		.then(() => t.fail('nope'))
		.catch(() => t.pass('yep'));
});
