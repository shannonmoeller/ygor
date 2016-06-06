'use strict';

var path = require('path');
var assign = require('object-assign');
var chalk = require('chalk');
var columns = require('cli-columns');
var minimist = require('minimist');

var script = path.basename(process.argv[1]);
var cli = minimist(process.argv.slice(2));

function noop() {
	// no operation
}

function ygor(options) {
	var promise;
	var tasks = Object.create(null);
	var localOptions = options || cli;
	var isVerbose = localOptions.v || localOptions.verbose;

	function sub(opts) {
		return ygor(opts);
	}

	function error(err) {
		console.error(err && err.stack || err);

		return sub;
	}

	function time(name) {
		var localName = '[' + chalk.green(script) + '] ' + chalk.magenta(name);

		console.log(localName + '...');
		console.time(localName);

		return function timeEnd(val) {
			console.timeEnd(localName);

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
		var timeEnd;
		var localName = name;
		var keys = Object.keys(tasks);

		if (!keys.length) {
			return null;
		}

		if (!arguments.length) {
			localName = localOptions._.shift();
		}

		localName = localName || 'default';

		if (!(localName in tasks)) {
			console.log(columns(keys));

			return null;
		}

		timeEnd = isVerbose ? time(localName) : noop;

		return Promise
			.resolve(tasks[localName](localOptions, sub))
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
		error: error,
		time: time,
		task: task,
		run: run,

		then: promise.then.bind(promise),
		catch: promise.catch.bind(promise),
	});
}

module.exports = ygor();
