
<img src="https://cloud.githubusercontent.com/assets/155164/13224204/703d357a-d955-11e5-9cfb-e7ed557324f2.png" alt="ygor" width="360" style="max-width:100%;height:1%;" />

[![NPM version][npm-img]][npm-url] [![Downloads][downloads-img]][npm-url] [![Tip][amazon-img]][amazon-url]

Ygor is yet another JavaScript task runner. For when `npm run` isn't enough and everything else is too much.

## Install

    $ npm install --save-dev ygor

## Usage

Node is the CLI. To run a task, pass the task name as an argument.

    $ node <script> [task]

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

ygor.task('bundle', bundle)
    .task('test', test);
```

Then run the script and indicate which task to perform.

    $ node make bundle

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

ygor.task('cover', cover)
    .task('test', test);
```

Then [run it](https://github.com/shannonmoeller/esprev).

    $ es make cover

or

    $ babel-node make cover

## API

### `ygor.cli`

Command-line arguments as parsed by [minimist](http://npm.im/minimist).

### `ygor.error(err) : ygor`

Logs an error, including a stack trace when available.

### `ygor.run(name) : Promise`

Tells Ygor to run a task.

### `ygor.task(name, function) : ygor`

Registers a task with Ygor.

## That's It?

Ygor doesn't know how to find, edit or watch files. NPM is his plugin system. He requests that you select the right tools for him. These look good:

### Finding Files

- [`find-config`](http://npm.im/find-config)
- [`findup-sync`](http://npm.im/findup-sync)
- [`glob-stream`](http://npm.im/glob-stream)
- [`globby`](http://npm.im/globby)
- [`look-up`](http://npm.im/look-up)
- [`mem-fs`](http://npm.im/mem-fs)
- [`node-glob`](http://npm.im/node-glob)
- [`vinyl-fs`](http://npm.im/vinyl-fs)

### Editing Files

- [`fs-extra`](http://npm.im/fs-extra)
- [`fs-promise`](http://npm.im/fs-promise)
- [`graceful-fs`](http://npm.im/graceful-fs)
- [`mem-fs-editor`](http://npm.im/mem-fs-editor)

### Watching Files

- [`chokidar`](http://npm.im/chokidar)
- [`chokidar-cli`](http://npm.im/chokidar-cli)
- [`graceful-chokidar`](http://npm.im/graceful-chokidar)
- [`watch`](http://npm.im/watch)

----

© Shannon Moeller <me@shannonmoeller.com> (shannonmoeller.com)

Licensed under [MIT](http://shannonmoeller.com/mit.txt)

[amazon-img]:    https://img.shields.io/badge/amazon-tip_jar-yellow.svg?style=flat-square
[amazon-url]:    https://www.amazon.com/gp/registry/wishlist/1VQM9ID04YPC5?sort=universal-price
[downloads-img]: http://img.shields.io/npm/dm/ygor.svg?style=flat-square
[npm-img]:       http://img.shields.io/npm/v/ygor.svg?style=flat-square
[npm-url]:       https://npmjs.org/package/ygor
