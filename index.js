'use strict';

var cli = require('minimist')(process.argv.slice(2));
var columns = require('cli-columns');
var tasks = Object.create(null);

function error(err) {
    console.error(err && err.stack || err);

    return exports;
}

function run(name) {
    name = name || 'default';

    if (!(name in tasks)) {
        console.error(columns(Object.keys(tasks)));
        return;
    }

    return Promise
        .resolve(tasks[name]())
        .catch(error);
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

process.nextTick(run.bind(null, cli._.shift()));
