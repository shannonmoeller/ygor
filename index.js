'use strict';

var cli = require('minimist')(process.argv.slice(2), {'--': true});
var command = cli._.shift() || cli['--'].shift() || 'default';
var tasks = {};

function run(name) {
    tasks[name]();
}

function task(name, fn) {
    tasks[name] = fn;
    return exports;
}

exports.cli = cli;
exports.run = run;
exports.task = task;

process.nextTick(run.bind(null, command));
