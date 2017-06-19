[![ygor](https://cdn.rawgit.com/shannonmoeller/ygor/4de4a22/media/logo.svg)](https://github.com/shannonmoeller/ygor#readme)

[![NPM version][npm-img]][npm-url] [![Downloads][downloads-img]][npm-url] [![Build Status][travis-img]][travis-url] [![Coverage Status][coveralls-img]][coveralls-url] [![Tip][amazon-img]][amazon-url]

JavaScript task runner. For when `npm run` isn't enough and everything else is too much.

## Install

    $ npm install --save-dev ygor

## Usage

Node is the CLI. To run a task, execute your script file and pass the task name as an argument.

    $ node <file> [task] [options]

      file  The filename of your script.
      task  The name of the task to run. Default: 'default'.

    Options

      -v, --verbose  Output task execution times.

## Example

Create a file, write some functions, tell Ygor.

```js
// make.js

var ygor = require('ygor');

function bundle() {
    // bundle something
}

function test() {
    // test something
}

ygor
    .task('default', bundle)
    .task('test', test);
```

Then run the script and indicate which task to perform.

    $ node make
    $ node make test

Need to run asynchronous tasks? Cool. Use the [`async` and `await` keywords](https://jakearchibald.com/2014/es7-async-functions/) for flow control.

```js
// make.js

import ygor from 'ygor';

async function instrument() {
    // instrument code coverage
}

async function test() {
    // test code
}

async function cover() {
    await instrument();
    await test();

    // report coverage
}

ygor
    .task('cover', cover)
    .task('test', test);
```

Then run it with [esprev](https://github.com/shannonmoeller/esprev) or [babel-node](http://babeljs.io/docs/usage/cli/#babel-node) ([presets](http://babeljs.io/docs/plugins/#official-presets) and [plugin](transform-async-to-generator) required).

    $ es make cover
    $ babel-node make cover

### Deferred Tasks

If you need to define tasks asynchronously, you may call `ygor()` as a function at a later time.

```js
TaskAPI
    .getTasks()
    .then(tasks => {
        return ygor()
            .task('foo', tasks.foo)
            .task('bar', tasks.bar);
    });
```

### Subtasks

You may also call `ygor()` within a task callback to create subtasks.

```js
function childA1() { console.log('hi from a1'); }
function childA2() { console.log('hi from a2'); }
function childB1() { console.log('hi from b1'); }
function childB2() { console.log('hi from b2'); }

function parentA() {
    // Subtasks
    return ygor()
        .task('1', childA1)
        .task('2', childA2);
}

function parentB() {
    // Subtasks
    return ygor()
        .task('1', childB1)
        .task('2', childB2);
}

ygor
    .task('a', parentA)
    .task('b', parentB);
```

Then execute subtasks by passing the parent task name as the first argument and the child task name as the second.

    $ node make a 2
    hi from a2
    $ node make b 1
    hi from b1

## API

### `ygor.cli`

Command-line arguments as parsed by [minimist](http://npm.im/minimist).

### `ygor.task(name, callback) : ygor`

- `name` `{String}` Unique task identifier.
- `callback` `{Function(cli, ygor)}` Function to run when the task is invoked.

Registers a task with Ygor. The callback provided will be executed with `ygor.cli` as the first argument and `ygor` as the second.

```js
function foo(cli, ygor) {
    console.log(cli, ygor);
}

ygor.task('foo', foo);
```

### `ygor.shell(command, options) : Promise`

- `command` `{String}` Shell command to execute.
- `options` `{Object}` Same options as `child_process.execSync()`.

Sometimes a shell command really is the best API, but maybe you'd like to keep all of your tasks in one tidy location. Ygor can execute arbitrary commands, ensuring that local and parent `./node_modules/.bin` dirs are in the PATH.

```js
function lint() {
    return ygor.shell('eslint "{src,test}/**/*.js"');
}

ygor.task('lint', lint);
```

### `ygor.error(err) : ygor`

- `err` `{Error|String}` Error to be logged.

Logs an error, including a stack trace when available. This is used internally to handle catchable errors. Some errors can't be caught by Ygor (such as errors in callbacks), so you may use this as a catch handler to keep the process from terminating.

```js
chokidar
    .watch('**/*.js')
    .on('change', function () {
        try {
            someSyncTask();
        } catch (err) {
            ygor.error(err);
        }

        someAsyncTask()
            .then(successHandler)
            .catch(ygor.error);
    });
```

### `ygor.run(name) : Promise`

- `name` `{String}` Unique task identifier.

Tells Ygor to run a task. This is used internally and generally shouldn't be invoked directly. Ygor recommends that tasks be declared as standalone functions.

```js
// Avoid

ygor.task('foo', function () {
    // do something
});

ygor.task('bar', function (cli, y) {
    y.run('foo');
});

// Recommended

function foo() {
    // do something
}

function bar() {
    foo();
}

ygor
    .task('foo', foo)
    .task('bar', bar);
```

## That's It?

Ygor doesn't know how to find, edit, or watch files. NPM is his plugin system. He requests that you select the right tools for him. You might like [`spiff`](http://npm.im/spiff), but these look good too:

### Finding Files

- [`find-config`](http://npm.im/find-config)
- [`findup-sync`](http://npm.im/findup-sync)
- [`glob-stream`](http://npm.im/glob-stream)
- [`globby`](http://npm.im/globby)
- [`look-up`](http://npm.im/look-up)
- [`mem-fs`](http://npm.im/mem-fs)
- [`node-glob`](http://npm.im/node-glob)

### Editing Files

- [`fs-extra`](http://npm.im/fs-extra)
- [`fs-promise`](http://npm.im/fs-promise)
- [`graceful-fs`](http://npm.im/graceful-fs)
- [`mem-fs-editor`](http://npm.im/mem-fs-editor)
- [`spiff`](http://npm.im/spiff)
- [`vinyl-fs`](http://npm.im/vinyl-fs)

### Watching Files

- [`browser-sync`](http://npm.im/browser-sync)
- [`budo`](http://npm.im/budo)
- [`chokidar`](http://npm.im/chokidar)
- [`chokidar-cli`](http://npm.im/chokidar-cli)
- [`graceful-chokidar`](http://npm.im/graceful-chokidar)
- [`watch`](http://npm.im/watch)

----

© Shannon Moeller <me@shannonmoeller.com> (shannonmoeller.com)

Licensed under [MIT](http://shannonmoeller.com/mit.txt)

[amazon-img]:    https://img.shields.io/badge/amazon-tip_jar-yellow.svg?style=flat-square
[amazon-url]:    https://www.amazon.com/gp/registry/wishlist/1VQM9ID04YPC5?sort=universal-price
[coveralls-img]: http://img.shields.io/coveralls/shannonmoeller/ygor/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/shannonmoeller/ygor
[downloads-img]: http://img.shields.io/npm/dm/ygor.svg?style=flat-square
[npm-img]:       http://img.shields.io/npm/v/ygor.svg?style=flat-square
[npm-url]:       https://npmjs.org/package/ygor
[travis-img]:    http://img.shields.io/travis/shannonmoeller/ygor/master.svg?style=flat-square
[travis-url]:    https://travis-ci.org/shannonmoeller/ygor
