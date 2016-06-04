'use strict';

var chalk = require('chalk');
var columns = require('cli-columns');
var minimist = require('minimist');
var path = require('path');

var script = path.basename(process.argv[1]);
var cli = minimist(process.argv.slice(2));

function noop() {}

function ygor(options) {
	options = options || cli;

	var tasks = Object.create(null);
	var isVerbose = options.v || options.verbose;

	function sub(options) {
		return ygor(options);
	}

	function error(err) {
		console.error(err && err.stack || err);

		return sub;
	}

	function time(name) {
		name = '[' + chalk.green(script) + '] ' + chalk.magenta(name);

		console.log(name + '...');
		console.time(name);

		return function timeEnd(val) {
			console.timeEnd(name);

			return val;
		};
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

	function run(name) {
		var keys = Object.keys(tasks);

		if (!keys.length) {
			return;
		}

		name = name || options._.shift() || 'default';

		if (!(name in tasks)) {
			console.log(columns(keys));
			return;
		}

		var timer = isVerbose ? time(name) : noop;

		return Promise
			.resolve(tasks[name](options, sub))
			.catch(error)
			.then(timer);
	}

	sub.cli = cli;
	sub.error = error;
	sub.time = time;
	sub.task = task;
	sub.run = run;

	var promise = new Promise(function (resolve) {
		process.nextTick(function () {
			resolve(run());
		});
	});

	sub.then = promise.then.bind(promise);
	sub.catch = promise.catch.bind(promise);

	return sub;
}

module.exports = ygor();
