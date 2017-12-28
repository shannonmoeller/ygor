/**
 * # List
 *
 * @module list
 */

import filter from 'p-filter';
import find from 'p-locate';
import map from 'p-map';
import reduce from 'p-reduce';
import some from 'p-some';

function first(arr, count = 1, options) {
	return some(arr, { count, ...options });
}

function flatten(arr) {
	return reduce(arr, (a, b) => a.concat(b), []);
}

function flatMap(...args) {
	return map(...args).then(flatten);
}

const methods = { filter, find, first, flatMap, flatten, map, reduce, some };
const methodNames = Object.keys(methods);

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
	const listPromise = { ...promise };

	methodNames.forEach(methodName => {
		const method = methods[methodName];

		listPromise[methodName] = (...args) =>
			list(promise.then(x => method(x, ...args)));
	});

	listPromise.then = (...args) =>
		promise
			.then(x => (Array.isArray(x) ? Promise.all(x) : [x]))
			.then(...args);

	return listPromise;
}
