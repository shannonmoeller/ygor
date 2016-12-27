'use strict';

var path = require('path');
var execSync = require('child_process').execSync;
var assign = require('object-assign');
var chalk = require('chalk');
var columns = require('cli-columns');
var minimist = require('minimist');
var npmPath = require('npm-path');

var script = path.basename(process.argv[1]);
var cli = minimist(process.argv.slice(2));

function noop(val) {
	return val;
}

function time(name) {
	var localName = `[${chalk.green(script)}] ${chalk.magenta(name)}`;

	console.log(`${localName}...`);
	console.time(localName);

	return function timeEnd(val) {
		console.timeEnd(localName);

		return val;
	};
}

function ygor(options) {
	var promise;
	var tasks = Object.create(null);
	var ygorOptions = options || cli;
	var isVerbose = ygorOptions.v || ygorOptions.verbose;

	function sub(opts) {
		return ygor(opts);
	}

	function task(name, callback) {
		if (typeof name !== 'string') {
			throw new Error('Task name must be a string.');
		}

		if (typeof callback !== 'function') {
			throw new Error('Task callback must be a function.');
		}

		tasks[name] = callback;

		return sub;
	}

	function shell(command, opts) {
		if (typeof command !== 'string') {
			throw new Error('Command must be a string.');
		}

		const shOptions = assign({ stdio: 'inherit' }, opts);
		const envPath = npmPath.getSync({ cwd: shOptions.cwd });

		shOptions.env = assign({}, process.env, { [npmPath.PATH]: envPath }, shOptions.env);

		return new Promise(function (resolve, reject) {
			try {
				resolve(execSync(command, shOptions));
			}
			catch (err) {
				reject(err);
			}
		});
	}

	function error(err) {
		console.error(err && err.stack || err);

		return sub;
	}

	function run(name) {
		var timeEnd;
		var localName = name;
		var keys = Object.keys(tasks);

		if (!keys.length) {
			return null;
		}

		if (!arguments.length) {
			localName = ygorOptions._.shift();
		}

		localName = localName || 'default';

		if (!(localName in tasks)) {
			console.log(columns(keys));

			return null;
		}

		timeEnd = isVerbose ? time(localName) : noop;

		return Promise
			.resolve(tasks[localName](ygorOptions, sub))
			.catch(error)
			.then(timeEnd);
	}

	promise = new Promise(function (resolve) {
		process.nextTick(function () {
			resolve(run());
		});
	});

	return assign(sub, {
		cli: cli,

		task: task,
		shell: shell,
		error: error,
		run: run,

		then: promise.then.bind(promise),
		catch: promise.catch.bind(promise),
	});
}

module.exports = ygor();
