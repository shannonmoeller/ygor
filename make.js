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

function qux() {
	ygor.error(new Error('should not throw'));
}

ygor.task('default', foo)
	.task('test', bar)
	.task('throw', baz)
	.task('error', qux);
