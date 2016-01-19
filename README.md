<img src="https://cloud.githubusercontent.com/assets/155164/12421443/5383e6b6-be90-11e5-9d03-cd5f71953de4.png" alt="ygor" width="360" />

[![NPM version][npm-img]][npm-url] [![Downloads][downloads-img]][npm-url] [![Tip][amazon-img]][amazon-url]

Task runner. For when `npm run` isn't enough and everything else is too much.

## Install

    $ npm install --save-dev ygor

## Usage

Node is the CLI. To run a task, pass the task name as an argument.

    node <script> [task]

## Example

Create a file, write some functions, tell Ygor, run the file.

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

Then run the script and tell it which task to perform.

    $ node make bundle

Need to run asynchronous tasks? Cool. Use async/await.

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

Then run it.

    $ babel-node make cover

## API

### `ygor.cli`

Command-line arguments as parsed by [minimist](http://npm.im/minimist).

### `ygor.task(name, function) : ygor`

Registers a task with Ygor.

----

© 2016 Shannon Moeller <me@shannonmoeller.com>

Licensed under [MIT](http://shannonmoeller.com/mit.txt)

[amazon-img]:    https://img.shields.io/badge/amazon-tip_jar-yellow.svg?style=flat-square
[amazon-url]:    https://www.amazon.com/gp/registry/wishlist/1VQM9ID04YPC5?sort=universal-price
[downloads-img]: http://img.shields.io/npm/dm/ygor.svg?style=flat-square
[npm-img]:       http://img.shields.io/npm/v/ygor.svg?style=flat-square
[npm-url]:       https://npmjs.org/package/ygor
