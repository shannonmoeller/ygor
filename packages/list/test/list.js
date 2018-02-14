import suite from 'blue-tape';
import list from '../src/list.js';

function delay(value, ms = Math.random() * 100) {
	return new Promise((resolve) => {
		setTimeout(() => resolve(value), ms);
	});
}

suite('@ygor/list', ({ test }) => {
	test('should resolve lists', async (t) => {
		const a = await list(['alpha', 'beta']);
		const b = await list(delay(['gamma', 'delta']));
		const c = await list([delay('epsilon'), 'zeta']);
		const d = await list(delay([delay('eta'), 'theta']));

		t.deepEqual(a, ['alpha', 'beta']);
		t.deepEqual(b, ['gamma', 'delta']);
		t.deepEqual(c, ['epsilon', 'zeta']);
		t.deepEqual(d, ['eta', 'theta']);
	});

	test('should throw', async (t) => {
		try {
			await list([Promise.reject('alpha'), 'beta']);
			t.fail('should throw');
		} catch (e) {
			t.pass('should throw');
		}
	});
});

suite('@ygor/list/filter', ({ test }) => {
	test('should filter items', async (t) => {
		const a = await list([
			delay('alpha', 10),
			'beta',
			'alfonzo',
			delay('bart'),
		]).filter((x) => x.startsWith('a'));

		t.deepEqual(a, ['alpha', 'alfonzo']);
	});
});

suite('@ygor/list/find', ({ test }) => {
	test('should', async (t) => {
		const a = await list([
			delay('alpha', 10),
			'beta',
			'alfonzo',
			delay('bart'),
		]).find((x) => x.startsWith('a'));

		t.deepEqual(a, ['alpha']);
	});
});

suite('@ygor/list/first', ({ test }) => {
	test('should return fastest resolved item', async (t) => {
		const a = await list([
			delay('alpha', 10),
			delay('beta', 5),
			delay('gamma', 20),
		]).first();

		t.deepEqual(a, ['beta']);
	});

	test('should return fastest resolved items', async (t) => {
		const a = await list([
			delay('alpha', 10),
			'beta',
			delay('gamma', 20),
		]).first(2);

		t.deepEqual(a, ['beta', 'alpha']);
	});
});

suite('@ygor/list/flatMap', ({ test }) => {
	test('should flatten mapped items', async (t) => {
		const a = await list([delay('alpha', 10), 'beta']).flatMap((x) => [
			x,
			x.toUpperCase(),
		]);

		t.deepEqual(a, ['alpha', 'ALPHA', 'beta', 'BETA']);
	});
});

suite('@ygor/list/flatten', ({ test }) => {
	test('should flatten lists of lists', async (t) => {
		const a = await list([
			[delay('alpha', 10), 'beta'],
			{ 0: 'gamma', length: 1 },
			'delta',
			delay(['epsilon', 'zeta', delay('eta', 5), 'theta'], 10),
		]).flatten();

		t.deepEqual(a, [
			'alpha',
			'beta',
			{ 0: 'gamma', length: 1 },
			'delta',
			'epsilon',
			'zeta',
			'eta',
			'theta',
		]);
	});
});

suite('@ygor/list/map', ({ test }) => {
	async function mapAsync(item) {
		await delay();

		return item.toUpperCase();
	}

	function mapSync(item, i) {
		return item + i;
	}

	test('should map items to new items', async (t) => {
		const a = await list(['alpha', 'beta'])
			.map(mapSync)
			.map(mapAsync);

		const b = await list(delay(['gamma', 'delta']))
			.map(mapAsync)
			.map(mapSync);

		const c = await list([delay('epsilon'), 'zeta'])
			.map(mapSync)
			.map(mapAsync);

		const d = await list(delay([delay('eta'), 'theta']))
			.map(mapAsync)
			.map(mapSync);

		t.deepEqual(a, ['ALPHA0', 'BETA1']);
		t.deepEqual(b, ['GAMMA0', 'DELTA1']);
		t.deepEqual(c, ['EPSILON0', 'ZETA1']);
		t.deepEqual(d, ['ETA0', 'THETA1']);
	});
});

suite('@ygor/list/reduce', ({ test }) => {
	test('should reduce items to item', async (t) => {
		const a = await list(['a', delay('b'), 'c']).reduce(
			(a, b) => a + b,
			''
		);

		t.deepEqual(a, ['abc']);
	});
});
