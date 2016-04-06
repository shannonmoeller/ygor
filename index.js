'use strict';

var chalk = require('chalk');
var columns = require('cli-columns');
var minimist = require('minimist');
var path = require('path');

var script = path.basename(process.argv[1]);
var cli = minimist(process.argv.slice(2));

var isVerbose = cli.v || cli.verbose;
var tasks = Object.create(null);

function noop() {}

function error(err) {
	console.error(err && err.stack || err);

	return exports;
}

function time(name) {
	name = '[' + chalk.green(script) + '] ' + chalk.magenta(name);

	console.log(name + '...');
	console.time(name);

	return console.timeEnd.bind(console, name);
}

function run(name) {
	name = name || 'default';

	if (!(name in tasks)) {
		console.log(columns(Object.keys(tasks)));
		return;
	}

	var timer = isVerbose ? time(name) : noop;

	return Promise
		.resolve(tasks[name]())
		.catch(error)
		.then(timer);
}

function task(name, callback) {
	if (typeof name !== 'string') {
		throw new Error('Task name must be a string.');
	}

	if (typeof callback !== 'function') {
		throw new Error('Task callback must be a function.');
	}

	tasks[name] = callback;

	return exports;
}

exports.cli = cli;
exports.error = error;
exports.run = run;
exports.task = task;
exports.time = time;

process.nextTick(run.bind(null, cli._.shift()));
