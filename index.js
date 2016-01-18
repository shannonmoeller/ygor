'use strict';

var cli = require('minimist')(process.argv.slice(2));
var command = cli._.shift() || 'default';
var tasks = {};

function task(name, fn) {
    tasks[name] = fn;
    return exports;
};

function run() {
    tasks[command]();
}

exports.cli = cli;
exports.task = task;

process.nextTick(run);
