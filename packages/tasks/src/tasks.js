/**
 * # Tasks
 *
 * @module tasks
 */

import columns from 'cli-columns';
import minimist from 'minimist';
import Time from 'time-diff';

const cli = minimist(process.argv.slice(2), {
	alias: { quiet: 'q' },
	boolean: ['quiet', 'run'],
	default: { quiet: false, run: true }
});

/**
 * Tasks factory.
 *
 * @method tasks
 * @param {Object} options
 * @exports
 */
function tasks(options = cli) {
	const registry = Object.create(null);

	function subtasks(subopts) {
		return tasks(subopts);
	}

	function add(name, task) {
		if (typeof name !== 'string') {
			throw new TypeError('Task name must be a string.');
		}

		if (typeof task !== 'function') {
			throw new TypeError('Task must be a function.');
		}

		registry[name] = task;

		return subtasks;
	}

	function time(name) {
		if (options.quiet) {
			return val => val;
		}

		const diff = new Time().diff(`${name}:`);

		diff('started');

		return val => {
			diff('finished');

			return val;
		};
	}

	function run(name) {
		const keys = Object.keys(registry);
		const promise = Promise.resolve();

		if (keys.length === 0) {
			return promise;
		}

		name = name || options._.shift() || 'default';

		const task = registry[name];

		if (!task) {
			console.log(columns(keys));

			return promise;
		}

		const done = time(name);

		return promise.then(() => task(options, subtasks)).then(done);
	}

	const promise = new Promise(resolve => {
		if (options.run === false) {
			return resolve();
		}

		process.nextTick(() => resolve(run()));
	});

	return Object.assign(subtasks, {
		cli,
		add,
		run,

		then: promise.then.bind(promise),
		catch: promise.catch.bind(promise)
	});
}

/**
 * Error handler.
 *
 * @method handleError
 * @param {Error} error
 */
export function handleError(error = 'An unknown error has occurred.') {
	const { code } = error;

	process.exitCode = code === undefined ? 1 : code;

	console.error(error);
}

// Register error handlers
process.on('uncaughtException', handleError);
process.on('unhandledRejection', handleError);

export default tasks();
