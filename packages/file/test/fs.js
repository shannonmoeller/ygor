import suite from 'blue-tape';
import mockFs from 'mock-fs';
import { mkdirp, stat } from '../src/fs.js';

suite('@ygor/file/fs', ({ test }) => {
	test('setup', async () => {
		mockFs({
			foo: {},
		});
	});

	test('should recursively create directories', async (t) => {
		await mkdirp('foo/bar/baz'.split('/'));
		await mkdirp('/foo/bar/baz'.split('/'));

		const a = await stat('foo/bar/baz');
		const b = await stat('/foo/bar/baz');

		t.ok(a.isDirectory());
		t.ok(b.isDirectory());
	});

	test('teardown', async () => {
		mockFs.restore();
	});
});
