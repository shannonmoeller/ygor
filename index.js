'use strict';

var cli = require('minimist')(process.argv.slice(2));
var tasks = Object.create(null);

function logError(error) {
    console.error(error && error.stack || error);
}

function run(name) {
    name = name || 'default';

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

process.nextTick(run.bind(null, cli._.shift()));
