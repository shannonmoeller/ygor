'use strict';

var ygor = require('../../index');

function dflt() {
	console.log('should run default task');
}

function tst() {
	console.log('should run named task');
}

function thrw() {
	throw new Error('should throw');
}

function errr() {
	ygor.error(new Error('should not throw'));
}

function parent() {
	function childA() {
		console.log('should run sub task');
	}

	function childB() {
		throw new Error('child b should not run');
	}

	return ygor()
		.task('childA', childA)
		.task('childB', childB);
}

ygor
	.task('default', dflt)
	.task('test', tst)
	.task('throw', thrw)
	.task('error', errr)
	.task('parent', parent);
