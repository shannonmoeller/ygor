import suite from 'blue-tape';
import mockFs from 'mock-fs';
import { find, read, write } from '../src/files.js';

suite('@ygor/files', ({ test }) => {
	const cwd = process.cwd();

	function toJSON(file) {
		return file.toJSON();
	}

	test('setup', async () => {
		mockFs({
			src: {
				alpha: {
					'beta.js': 'lorem ipsum',
					'gamma.js': 'dolor sit',
				},
				delta: {
					'epsilon.js': 'lorem ipsum',
					'zeta.css': 'dolor sit',
				},
				'eta.js': 'lorem ipsum',
				'theta.css': 'dolor sit',
			},
		});
	});

	test('should not find files', async (t) => {
		const a = await find();
		const b = await find('src/**/*.ext');
		const c = await find('foo/**/*.js');

		t.deepEqual(a, []);
		t.deepEqual(b, []);
		t.deepEqual(c, []);
	});

	test('should find files', async (t) => {
		const a = await find('src/**/*.js').map(toJSON);
		const b = await find('./src/**/*.js').map(toJSON);
		const c = await find('**/*.js', { cwd: 'src' }).map(toJSON);
		const d = await find('./**/*.js', { cwd: 'src' }).map(toJSON);
		const e = await find(`${__dirname}/../../../src/**/*.js`).map(toJSON);
		const f = await find('../../../src/**/*.js', { cwd: __dirname }).map(
			toJSON
		);
		const g = await find('**/*.js', {
			cwd: `${__dirname}/../../../src`,
		}).map(toJSON);

		t.deepEqual(a, b);
		t.deepEqual(a, c);
		t.deepEqual(a, d);
		t.deepEqual(a, e);
		t.deepEqual(a, f);
		t.deepEqual(a, g);

		t.deepEqual(a, [
			{
				cwd: `${cwd}/src`,
				path: 'alpha/beta.js',
				contents: undefined,
			},
			{
				cwd: `${cwd}/src`,
				path: 'alpha/gamma.js',
				contents: undefined,
			},
			{
				cwd: `${cwd}/src`,
				path: 'delta/epsilon.js',
				contents: undefined,
			},
			{
				cwd: `${cwd}/src`,
				path: 'eta.js',
				contents: undefined,
			},
		]);
	});

	test('should read files', async (t) => {
		const a = await find('src/**/*.js')
			.map(read())
			.map(toJSON);

		t.deepEqual(a, [
			{
				cwd: `${cwd}/src`,
				path: 'alpha/beta.js',
				contents: 'lorem ipsum',
			},
			{
				cwd: `${cwd}/src`,
				path: 'alpha/gamma.js',
				contents: 'dolor sit',
			},
			{
				cwd: `${cwd}/src`,
				path: 'delta/epsilon.js',
				contents: 'lorem ipsum',
			},
			{
				cwd: `${cwd}/src`,
				path: 'eta.js',
				contents: 'lorem ipsum',
			},
		]);

		const b = await find('src/**/*.js')
			.map(read('base64'))
			.map(toJSON);

		const c = await find('src/**/*.js')
			.map(read({ encoding: 'base64' }))
			.map(toJSON);

		t.deepEqual(b, c);
		t.deepEqual(b, [
			{
				cwd: `${cwd}/src`,
				path: 'alpha/beta.js',
				contents: 'bG9yZW0gaXBzdW0=',
			},
			{
				cwd: `${cwd}/src`,
				path: 'alpha/gamma.js',
				contents: 'ZG9sb3Igc2l0',
			},
			{
				cwd: `${cwd}/src`,
				path: 'delta/epsilon.js',
				contents: 'bG9yZW0gaXBzdW0=',
			},
			{
				cwd: `${cwd}/src`,
				path: 'eta.js',
				contents: 'bG9yZW0gaXBzdW0=',
			},
		]);

		const d = await find('src/**/*.js')
			.map(read(null))
			.map(toJSON);

		const e = await find('src/**/*.js')
			.map(read({ encoding: null }))
			.map(toJSON);

		t.deepEqual(d, e);
		t.equal(d.length, 4);
		t.equal(d[0].contents instanceof Buffer, true);
		t.equal(String(d[0].contents), 'lorem ipsum');
		t.equal(String(d[1].contents), 'dolor sit');
	});

	test('should write files', async (t) => {
		await find('src/**/*.js')
			.map(read())
			.map((x) => {
				x.contents = x.contents.toUpperCase();

				return x;
			})
			.map(write())
			.map(write('../dest-a'))
			.map(write({ cwd: `${cwd}/dest-b` }));

		const src = await find('src/**/*.js')
			.map(read())
			.map(toJSON);

		t.deepEqual(src, [
			{
				cwd: `${cwd}/src`,
				path: 'alpha/beta.js',
				contents: 'LOREM IPSUM',
			},
			{
				cwd: `${cwd}/src`,
				path: 'alpha/gamma.js',
				contents: 'DOLOR SIT',
			},
			{
				cwd: `${cwd}/src`,
				path: 'delta/epsilon.js',
				contents: 'LOREM IPSUM',
			},
			{
				cwd: `${cwd}/src`,
				path: 'eta.js',
				contents: 'LOREM IPSUM',
			},
		]);

		const a = await find('dest-a/**/*.js')
			.map(read())
			.map(toJSON);

		t.deepEqual(a, [
			{
				cwd: `${cwd}/dest-a`,
				path: 'alpha/beta.js',
				contents: 'LOREM IPSUM',
			},
			{
				cwd: `${cwd}/dest-a`,
				path: 'alpha/gamma.js',
				contents: 'DOLOR SIT',
			},
			{
				cwd: `${cwd}/dest-a`,
				path: 'delta/epsilon.js',
				contents: 'LOREM IPSUM',
			},
			{
				cwd: `${cwd}/dest-a`,
				path: 'eta.js',
				contents: 'LOREM IPSUM',
			},
		]);

		const b = await find('dest-b/**/*.js')
			.map(read())
			.map(toJSON);

		t.deepEqual(b, [
			{
				cwd: `${cwd}/dest-b`,
				path: 'alpha/beta.js',
				contents: 'LOREM IPSUM',
			},
			{
				cwd: `${cwd}/dest-b`,
				path: 'alpha/gamma.js',
				contents: 'DOLOR SIT',
			},
			{
				cwd: `${cwd}/dest-b`,
				path: 'delta/epsilon.js',
				contents: 'LOREM IPSUM',
			},
			{
				cwd: `${cwd}/dest-b`,
				path: 'eta.js',
				contents: 'LOREM IPSUM',
			},
		]);
	});

	test('teardown', async () => {
		mockFs.restore();
	});
});
