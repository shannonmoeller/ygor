import suite from 'blue-tape';
import list from '../src/list.js';

suite('@ygor/list', ({ test }) => {
	function delay(value) {
		return new Promise(resolve => {
			setTimeout(() => resolve(value), Math.random() * 100);
		});
	}

	async function mapAsync(item) {
		await delay();

		return item.toUpperCase();
	}

	function mapSync(item, i) {
		return item + i;
	}

	test('should resolve lists', async t => {
		const a = await list(['alpha', 'beta']);
		const b = await list(delay(['gamma', 'delta']));
		const c = await list([delay('epsilon'), 'zeta']);
		const d = await list(delay([delay('eta'), 'theta']));

		t.deepEqual(a, ['alpha', 'beta']);
		t.deepEqual(b, ['gamma', 'delta']);
		t.deepEqual(c, ['epsilon', 'zeta']);
		t.deepEqual(d, ['eta', 'theta']);
	});

	test('should map lists', async t => {
		const a = await list(['alpha', 'beta'])
			.map(mapAsync)
			.map(mapSync);

		const b = await list(delay(['gamma', 'delta']))
			.map(mapAsync)
			.map(mapSync);

		const c = await list([delay('epsilon'), 'zeta'])
			.map(mapAsync)
			.map(mapSync);

		const d = await list(delay([delay('eta'), 'theta']))
			.map(mapAsync)
			.map(mapSync);

		t.deepEqual(a, ['ALPHA0', 'BETA1']);
		t.deepEqual(b, ['GAMMA0', 'DELTA1']);
		t.deepEqual(c, ['EPSILON0', 'ZETA1']);
		t.deepEqual(d, ['ETA0', 'THETA1']);
	});

	test('should throw', async t => {
		try {
			await list([Promise.reject('alpha'), 'beta']).map(mapAsync);
			t.fail('should throw');
		} catch (e) {
			t.pass('should throw');
		}
	});
});
