'use strict';

var cli = require('minimist')(process.argv.slice(2));
var command = cli._.shift() || 'default';
var tasks = Object.create(null);

function logError(error) {
    var stack = error && error.stack;

    console.log(stack || error);
}

function run(name) {
    if (!(name in tasks)) {
        console.error('Tasks:\n  ' + Object.keys(tasks).join('\n  '));
        return;
    }

    return Promise
        .resolve(tasks[name]())
        .catch(logError);
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
exports.run = run;
exports.task = task;

process.nextTick(run.bind(null, command));
