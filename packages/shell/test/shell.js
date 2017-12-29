import suite from 'blue-tape';
import shell from '../src/shell.js';

suite('@ygor/shell', ({ test }) => {
	test('should execute a command', async t => {
		const hello = 'hello world';
		const foo = 'foo bar';

		const a = await shell`
			echo ${hello}
			echo ${foo}
		`;

		t.equal(a.code, 0);

		const b = await shell({ stdio: 'pipe' })`
			echo ${hello}
			>&2 echo ${foo}
		`;

		t.equal(b.stdout, 'hello world');
		t.equal(b.stderr, 'foo bar');

		try {
			await shell({ stdio: 'pipe' })`
				echo ${hello}
				>&2 echo ${foo}
				exit 123
			`;

			t.fail('should fail');
		} catch (e) {
			t.equal(e.code, 123);
			t.equal(e.stdout, 'hello world\n');
			t.equal(e.stderr, 'foo bar\n');

			t.pass('should fail');
		}
	});
});
