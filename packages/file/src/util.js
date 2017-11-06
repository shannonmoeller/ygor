/**
 * # Utilities
 *
 * @module util
 */

/**
 * @method assertString
 * @param {String} key
 * @param {Any} val
 * @param {Object} options
 * @param {Boolean} options.truthy
 * @export
 */
export function assertString(key, val) {
	if (typeof val !== 'string') {
		throw new TypeError(`${key} must be a string. Received ${val}`);
	}
}

/**
 * @method assertNonEmptyString
 * @param {String} key
 * @param {Any} val
 * @export
 */
export function assertNonEmptyString(key, val) {
	assertString(key, val);

	if (!val) {
		throw new TypeError(`${key} must not be empty.`);
	}
}

/**
 * @method promisify
 * @param {Function} fn
 * @return {Function}
 * @export
 */
export function promisify(fn) {
	return function promisified(...args) {
		return new Promise((resolve, reject) =>
			fn(...args, (err, val) => (err ? reject(err) : resolve(val)))
		);
	};
}
