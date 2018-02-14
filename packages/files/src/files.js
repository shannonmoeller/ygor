/**
 * # Files
 *
 * @module files
 */

import path from 'path';
import globby from 'globby';
import globParent from 'glob-parent';
import file from '@ygor/file';
import list from '@ygor/list';

/**
 * @method find
 * @param {String|Array<String>} pattern
 * @param {Object} options
 * @default
 */
export function find(pattern, options = {}) {
	const patterns = [].concat(pattern || []);
	const parent = globParent(patterns[0]);

	const cwd = path.resolve(process.cwd(), options.cwd || '');
	const workdir = `${path.resolve(cwd, parent)}/`;

	const globOptions = {
		ignore: ['**/node_modules/**'],
		absolute: true,
		nodir: true,
		...options,
		cwd,
	};

	return list(globby(patterns, globOptions)).map((x) =>
		file({
			cwd: workdir,
			path: x.replace(workdir, ''),
		})
	);
}

/**
 * @method read
 * @param {Object|String} options
 * @default
 */
export function read(options) {
	if (options === null || typeof options === 'string') {
		options = { encoding: options };
	}

	return (x) => x.read(options);
}

/**
 * @method write
 * @param {Object|String} options
 * @default
 */
export function write(options) {
	if (typeof options === 'string') {
		options = { cwd: options };
	}

	return (x) => x.write(options);
}

export { file, list };
