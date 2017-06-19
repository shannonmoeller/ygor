'use strict';

const path = require('path');
const execSync = require('child_process').execSync;
const chalk = require('chalk');
const columns = require('cli-columns');
const minimist = require('minimist');
const npmPath = require('npm-path');

const script = path.basename(process.argv[1]);
const cli = minimist(process.argv.slice(2));

function noop(val) {
	return val;
}

function time(name) {
	const localName = `[${chalk.green(script)}] ${chalk.magenta(name)}`;

	console.log(`${localName}...`);
	console.time(localName);

	return val => {
		console.timeEnd(localName);

		return val;
	};
}

function ygor(options) {
	const tasks = Object.create(null);
	const ygorOptions = options || cli;
	const isVerbose = ygorOptions.v || ygorOptions.verbose;

	function sub(opts) {
		return ygor(opts);
	}

	function task(name, callback) {
		if (typeof name !== 'string') {
			throw new TypeError('Task name must be a string.');
		}

		if (typeof callback !== 'function') {
			throw new TypeError('Task callback must be a function.');
		}

		tasks[name] = callback;

		return sub;
	}

	function shell(command, opts) {
		if (typeof command !== 'string') {
			throw new TypeError('Command must be a string.');
		}

		const shOptions = Object.assign({stdio: 'inherit'}, opts);
		const envPath = npmPath.getSync({cwd: shOptions.cwd});

		shOptions.env = Object.assign(
			{},
			process.env,
			{[npmPath.PATH]: envPath},
			shOptions.env
		);

		return new Promise((resolve, reject) => {
			try {
				resolve(execSync(command, shOptions));
			} catch (err) {
				reject(err);
			}
		});
	}

	function error(err) {
		console.error((err && err.stack) || err);

		return sub;
	}

	function run(name) {
		let localName = name;
		const keys = Object.keys(tasks);

		if (keys.length === 0) {
			return null;
		}

		if (arguments.length === 0) {
			localName = ygorOptions._.shift();
		}

		localName = localName || 'default';

		if (!(localName in tasks)) {
			console.log(columns(keys));

			return null;
		}

		const timeEnd = isVerbose ? time(localName) : noop;

		return Promise
			.resolve(tasks[localName](ygorOptions, sub))
			.catch(error)
			.then(timeEnd);
	}

	const promise = new Promise(resolve => {
		process.nextTick(() => {
			resolve(run());
		});
	});

	return Object.assign(sub, {
		cli,
		task,
		shell,
		error,
		run,
		then: promise.then.bind(promise),
		catch: promise.catch.bind(promise)
	});
}

module.exports = ygor();
