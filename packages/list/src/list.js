/**
 * # List
 *
 * @module list
 */

/**
 * List factory.
 *
 * @method list
 * @param {Array|Promise<Array>} arr
 * @return {Promise<Array>}
 * @default
 */
export default function list(arr) {
	const promise = Promise.resolve(arr);

	return {
		...promise,

		map(fn) {
			function asyncMap(item, i) {
				return Promise.resolve(item).then(x => fn(x, i));
			}

			return list(promise.then(x => x.map(asyncMap)));
		},

		then(...args) {
			return promise.then(x => Promise.all(x)).then(...args);
		}
	};
}
