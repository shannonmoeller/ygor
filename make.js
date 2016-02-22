'use strict';

var ygor = require('./index');

function foo() {
    console.log('should run default task');
}

function bar() {
    console.log('should run named task');
}

function baz() {
    throw new Error('should throw');
}

ygor.task('default', foo)
    .task('test', bar)
    .task('error', baz);
