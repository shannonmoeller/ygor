import suite from 'blue-tape';
import { assertString, assertNonEmptyString, promisify } from '../src/util.js';

suite('@ygor/file/util', ({ test }) => {
	test('should require a string', async t => {
		t.throws(() => assertString('foo'), /foo must/);
		t.throws(() => assertString('bar', null), /bar must/);
		t.throws(() => assertString('baz', 1), /baz must/);
		t.throws(() => assertString('qux', true), /qux must/);
		t.throws(() => assertString('quux', {}), /quux must/);

		t.doesNotThrow(() => assertString('foo', ''));
		t.doesNotThrow(() => assertString('bar', 'lorem ipsum'));
	});

	test('should require a non-empty string', async t => {
		t.throws(() => assertNonEmptyString('foo', ''), /foo must/);
		t.doesNotThrow(() => assertNonEmptyString('bar', 'lorem ipsum'));
	});

	test('should convert a callback interface to a promise interface', async t => {
		function pass(a, b, cb) {
			cb(null, a + b);
		}

		function fail(a, b, cb) {
			cb('derp');
		}

		const passPromise = promisify(pass);
		const failPromise = promisify(fail);

		t.equal(await passPromise(1, 2), 3);

		try {
			await failPromise(1, 2);
			t.fail('should throw');
		} catch (e) {
			t.pass('should throw');
		}
	});
});
