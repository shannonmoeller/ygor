import suite from 'blue-tape';
import mockFs from 'mock-fs';
import { readFile, stat } from '../src/fs.js';
import file from '../src/file.js';

suite('@ygor/file', ({ test }) => {
	test('setup', async () => {
		mockFs({
			foo: {
				'delete.me': 'so long',
				'read.me': 'hello world',
				'stat.me': 'i byte, therefore i am'
			}
		});
	});

	test('should represent an empty file', async t => {
		const foo = file();

		t.equal(foo.cwd, process.cwd());
		t.equal(foo.path, undefined);
		t.deepEqual(foo.history, [undefined]);
		t.equal(foo.contents, undefined);

		t.throws(() => foo.absolute);
		t.throws(() => foo.dirname);
		t.throws(() => foo.basename);
		t.throws(() => foo.stem);
		t.throws(() => foo.extname);

		t.deepEqual(foo.toJSON(), {
			cwd: process.cwd(),
			path: undefined,
			contents: undefined
		});

		t.deepEqual(foo.toString(), '<File "undefined" "undefined">');
	});

	test('should represent a full file', async t => {
		const foo = file({
			cwd: '/a',
			path: 'b/c/file.ext',
			contents: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
		});

		t.equal(foo.cwd, '/a');
		t.equal(foo.path, 'b/c/file.ext');
		t.deepEqual(foo.history, ['b/c/file.ext']);
		t.equal(
			foo.contents,
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
		);

		t.equal(foo.absolute, '/a/b/c/file.ext');
		t.equal(foo.dirname, 'b/c');
		t.equal(foo.basename, 'file.ext');
		t.equal(foo.stem, 'file');
		t.equal(foo.extname, '.ext');

		t.deepEqual(foo.toJSON(), {
			cwd: '/a',
			path: 'b/c/file.ext',
			contents: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
		});

		t.deepEqual(
			foo.toString(),
			'<File "b/c/file.ext" "Lorem ipsum dolor sit amet, cons...">'
		);
	});

	test('should manage dirnames', async t => {
		const foo = file({ path: '/a/b/file.ext' });

		t.equal(foo.dirname, '/a/b');

		foo.dirname = '/c/d';

		t.equal(foo.dirname, '/c/d');

		t.throws(() => {
			foo.dirname = null;
		});

		t.equal(foo.path, '/c/d/file.ext');

		t.deepEqual(foo.history, ['/a/b/file.ext', '/c/d/file.ext']);
	});

	test('should manage basenames', async t => {
		const foo = file({ path: '/a/b/file.ext' });

		t.equal(foo.basename, 'file.ext');

		foo.basename = 'foo.bar';

		t.equal(foo.basename, 'foo.bar');

		t.throws(() => {
			foo.basename = null;
		});

		t.equal(foo.path, '/a/b/foo.bar');

		t.deepEqual(foo.history, ['/a/b/file.ext', '/a/b/foo.bar']);
	});

	test('should manage stems', async t => {
		const foo = file({ path: '/a/b/file.ext' });

		t.equal(foo.stem, 'file');

		foo.stem = 'foo';

		t.equal(foo.stem, 'foo');

		t.throws(() => {
			foo.stem = null;
		});

		t.equal(foo.path, '/a/b/foo.ext');

		t.deepEqual(foo.history, ['/a/b/file.ext', '/a/b/foo.ext']);
	});

	test('should manage extnames', async t => {
		const foo = file({ path: '/a/b/file.ext' });

		t.equal(foo.extname, '.ext');

		foo.extname = '.bar';

		t.equal(foo.extname, '.bar');

		t.throws(() => {
			foo.extname = null;
		});

		t.equal(foo.path, '/a/b/file.bar');

		t.deepEqual(foo.history, ['/a/b/file.ext', '/a/b/file.bar']);
	});

	test('should delete', async t => {
		const foo = file({ path: 'foo/delete.me' });
		const bar = await foo.delete();

		t.equal(foo, bar);

		try {
			await stat('foo/delete.me');
			t.fail('should throw');
		} catch (e) {
			t.pass('should throw');
		}
	});

	test('should read', async t => {
		const foo = file({ path: 'foo/read.me' });

		t.equal(foo.contents, undefined);

		const bar = await foo.read();

		t.equal(foo, bar);
		t.equal(foo.contents, 'hello world');

		try {
			await file({ path: 'foo/fake.me' }).read();
			t.fail('should throw');
		} catch (e) {
			t.pass('should throw');
		}
	});

	test('should stat', async t => {
		const foo = file({ path: 'foo/stat.me' });
		const stat = await foo.stat();

		t.ok(stat.hasOwnProperty('atime'));
		t.ok(stat.hasOwnProperty('ctime'));
		t.ok(stat.hasOwnProperty('mtime'));

		try {
			await file({ path: 'foo/fake.me' }).stat();
			t.fail('should throw');
		} catch (e) {
			t.pass('should throw');
		}
	});

	test('should write', async t => {
		const foo = file({
			cwd: 'foo/bar',
			path: 'baz/write.me',
			contents: 'lorem ipsum'
		});

		t.equal(foo.contents, 'lorem ipsum');

		const bar = await foo.write();
		const baz = await foo.write({ cwd: '../qux' });

		t.equal(foo, bar);
		t.equal(await readFile('foo/bar/baz/write.me', 'utf8'), 'lorem ipsum');

		t.equal(bar, baz);
		t.equal(await readFile('foo/qux/baz/write.me', 'utf8'), 'lorem ipsum');
	});

	test('teardown', async () => {
		mockFs.restore();
	});
});
