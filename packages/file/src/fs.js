/**
 * # File System I/O
 *
 * @module fs
 */

import fs from 'fs';
import path from 'path';
import { promisify } from './util.js';

/**
 * Promisified `fs.mkdir`.
 *
 * @method mkdir
 * @return {Promise}
 * @export
 */
export const mkdir = promisify(fs.mkdir);

/**
 * Promisified `fs.readFile`.
 *
 * @method readFile
 * @return {Promise}
 * @export
 */
export const readFile = promisify(fs.readFile);

/**
 * Promisified `fs.stat`.
 *
 * @method stat
 * @return {Promise}
 * @export
 */
export const stat = promisify(fs.stat);

/**
 * Promisified `fs.unlink`.
 *
 * @method unlink
 * @return {Promise}
 * @export
 */
export const unlink = promisify(fs.unlink);

/**
 * Promisified `fs.writeFile`.
 *
 * @method writeFile
 * @return {Promise}
 * @export
 */
export const writeFile = promisify(fs.writeFile);

/**
 * Recursively make directories (like `mkdir -p`).
 *
 * @method mkdirp
 * @param {Array<String>} dirNames
 * @return {Promise}
 * @export
 */
export function mkdirp(dirNames, i = 1) {
	if (i > dirNames.length) {
		return true;
	}

	const dir = dirNames.slice(0, i).join(path.sep);

	return mkdir(dir)
		.catch(e => e) // ignore errors
		.then(() => mkdirp(dirNames, i + 1));
}
