<p align="center">
	<a href="https://github.com/shannonmoeller/ygor#readme"><img src="https://cdn.rawgit.com/shannonmoeller/ygor/4de4a22/media/logo.svg" alt="ygor" width="480" /></a>
</p>

<p align="center">
	For when <code>npm run</code> isn't enough and everything else is too much.
</p>

<p align="center">
	<a href="http://npm.im/ygor"><img src="https://img.shields.io/npm/v/ygor.svg?style=flat-square" alt="version" /></a>
	<a href="http://npm.im/ygor"><img src="http://img.shields.io/npm/dm/ygor.svg?style=flat-square" alt="downloads" /></a>
	<a href="https://travis-ci.org/shannonmoeller/ygor"><img src="http://img.shields.io/travis/shannonmoeller/ygor.svg?style=flat-square" alt="build status" /></a>
	<a href="https://coveralls.io/r/shannonmoeller/ygor"><img src="http://img.shields.io/coveralls/shannonmoeller/ygor/master.svg?style=flat-square" alt="coverage status" /></a>
</p>

[Ygor](http://npm.im/ygor) is a toolkit consisting of a [task runner](#task-runner), a [file transformer](#file-transformer), and [array promises](#array-promises). You can use it as a whole or only grab the parts you want. Ygor leans heavily on [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) and works wonderfully with [async and await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) in Node 8 and above.

# Toolkit

Using the whole toolkit together looks something like this.

```sh
$ npm install --save ygor
```

```js
// make.js

const { tasks, shell, find, read, write } = require('ygor');
const prettier = require('prettier');

function formatCss() {
	// Sometimes the CLI is the best API
	return shell('prettier --write **/*.css');
}

function formatJs(cli) {
	// Sometimes you want a little more control
	return find('src/**/*.js')
		.map(read())
		.map(file => {
			file.contents = prettier.format(file.contents, {
				semi: cli.semi
			});

			return file;
		});
		.map(write('dest'));
}

async function format(cli) {
	await formatCss(cli);
	await formatJs(cli);
}

tasks
	.add('css', formatCss);
	.add('js', formatJs)
	.add('default', format);
```

```sh
$ node make js --semi
```

See [ygor](http://npm.im/ygor) for the complete API.

# Task Runner

```sh
$ npm install --save @ygor/tasks
```

```js
// make.js

const tasks = require('@ygor/tasks');

async function foo() {
	console.log('foo');
}

async function bar() {
	console.log('bar');
}

function build(cli) {
	return Promise.all([
		foo(cli),
		bar(cli)
	]);
}

tasks
	.add('foo', foo)
	.add('bar', bar)
	.add('default', build);
```

```sh
$ node make foo  # runs `foo` task
$ node make bar  # runs `bar` task
$ node make      # runs `default` task
```

See [@ygor/tasks](http://npm.im/@ygor/tasks) for complete documentation.

# File Transformer

```sh
$ npm install --save @ygor/files
```

```js
const { find, read, write } = require('@ygor/files');

find('src/**/*.js')
	.map(read())
	.map(file => {
		file.contents = file.contents.toUpperCase();

		return file;
	})
	.map(write('dest'));
```

See [@ygor/files](http://npm.im/@ygor/files) for complete documentation.

# Array Promises

```sh
$ npm install --save @ygor/list
```

See [@ygor/list](http://npm.im/@ygor/list) for complete documentation.

----

© 2017 Shannon Moeller <me@shannonmoeller.com>

Licensed under [MIT](http://shannonmoeller.com/mit.txt)
