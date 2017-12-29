import suite from 'blue-tape';
import tasks, { handleError } from '../src/tasks.js';

suite('@ygor/tasks/add', ({ test }) => {
	test('should register tasks', async t => {
		t.throws(() => tasks.add());
		t.throws(() => tasks.add('foo'));

		t.throws(() =>
			tasks.add(null, () => {
				t.fail('should not register unnamed');
			})
		);

		t.doesNotThrow(() =>
			tasks.add('bar', () => {
				t.pass('should not register non-function');
			})
		);
	});

	test('should run default task', async t => {
		const cli = { _: [], quiet: true };

		await tasks(cli)
			.add('foo', () => t.fail('should not run foo'))
			.add('bar', () => t.fail('should not run bar'))
			.add('default', () => t.pass('should run default'));
	});

	test('should run specific task', async t => {
		const cli = { _: ['foo'], quiet: true };

		await tasks(cli)
			.add('foo', () => t.pass('should run foo'))
			.add('bar', () => t.fail('should not run bar'))
			.add('default', () => t.fail('should not run default'));
	});

	test('should run deep tasks', async t => {
		const cli = { _: ['bar', 'foo'], quiet: true };

		await tasks(cli)
			.add('foo', () => t.fail('should not run outer foo'))
			.add('bar', async () => {
				t.pass('should run outer bar');

				await tasks(cli)
					.add('foo', () => t.pass('should run inner foo'))
					.add('bar', () => t.fail('should not run inner bar'));
			});
	});

	test('should print task names', async t => {
		const cli = { _: ['derp'] };

		await tasks(cli)
			.add('foo', () => t.fail('should not run foo'))
			.add('bar', () => t.fail('should not run bar'))
			.add('default', () => t.fail('should not run default'));
	});

	test('should not run', async t => {
		const cli = { _: [], run: false };

		await tasks(cli)
			.add('foo', () => t.fail('should not run foo'))
			.add('bar', () => t.fail('should not run bar'))
			.add('default', () => t.fail('should not run default'));
	});

	test('should run later', async t => {
		const cli = { _: ['bar'], quiet: true, run: false };

		const runner = tasks(cli)
			.add('foo', () => t.fail('should not run foo'))
			.add('bar', () => t.fail('should not run bar'))
			.add('default', () => t.fail('should not run default'));

		await runner;

		await runner.add('bar', () => t.pass('should run bar')).run();
	});

	test('should return task value', async t => {
		const cli = { _: ['bar', 'foo'] };

		const actual = await tasks(cli)
			.add('foo', () => t.fail('should not run outer foo'))
			.add('bar', () =>
				tasks(cli)
					.add('foo', () => 'hello world')
					.add('bar', () => t.fail('should not run inner bar'))
			);

		t.equal(actual, 'hello world');
	});
});

suite('@ygor/tasks/handleError', ({ test }) => {
	test('should handle errors', async t => {
		t.doesNotThrow(() => {
			handleError('should log this error');
		});
	});
});
