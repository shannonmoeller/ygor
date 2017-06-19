import test from 'ava';
import ygor from '../index';

test('should execute', async t => {
	t.plan(1);

	await ygor
		.shell('echo bar')
		.then(() => t.pass('yep'))
		.catch(() => t.fail('nope'));
});

test('should fail to execute', async t => {
	t.plan(1);

	await ygor
		.shell('/dev/null/null')
		.then(() => t.fail('nope'))
		.catch(() => t.pass('yep'));
});

test('should throw on invalid input', t => {
	t.plan(1);

	t.throws(() => ygor.shell(), /string/i);
});
