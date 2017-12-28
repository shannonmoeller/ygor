# ygor

[![NPM version][npm-img]][npm-url] [![Downloads][downloads-img]][npm-url] [![Build Status][travis-img]][travis-url] [![Coverage Status][coveralls-img]][coveralls-url]

[Ygor](https://github.com/shannonmoeller/ygor#readme) is a no-frills toolkit consisting of a [task runner](http://npm.im/@ygor/tasks) and a [file transformer](http://npm.im/@ygor/files). Enjoy as a whole or a la carte. Built on [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) to work wonderfully with [`async` and `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) in Node.js 8 and above.

Node is the CLI, npm is the plugin system. Go nuts.

## Install

```console
$ npm install --save-dev ygor
```

## Usage

Create a JavaScript file, write some functions, tell Ygor.

```js
// make.js

const { tasks, find, read, write } = require('ygor');
const { shell } = require('execa');
const { transform } = require('babel-core');

function buildCss() {
  return shell('postcss --use autoprefixer --dir dest src/**/*.css');
}

function buildJs(cli) {
  return find('src/**/*.js')
    .map(read())
    .map(file => {
      file.contents = transform(file.contents, cli).code;

      return file;
    })
    .map(write('dest'));
}

async function build(cli) {
  await buildCss(cli);
  await buildJs(cli);
}

tasks
  .add('css', buildCss);
  .add('js', buildJs)
  .add('default', build);
```

To run a task, execute the file with [Node.js](https://nodejs.org) and indicate which task to perform.

```console
$ node make js --minified
```

## API

See [`@ygor/tasks`](http://npm.im/@ygor/tasks) for complete documentation on the task runner (`tasks`).

See [`@ygor/files`](http://npm.im/@ygor/files) for complete documentation on the file transformer (`find`, `read`, `write`).

----

© 2017 Shannon Moeller <me@shannonmoeller.com> (shannonmoeller.com)

Licensed under [MIT](http://shannonmoeller.com/mit.txt)

[coveralls-img]: http://img.shields.io/coveralls/shannonmoeller/ygor/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/shannonmoeller/ygor
[downloads-img]: http://img.shields.io/npm/dm/ygor.svg?style=flat-square
[npm-img]:       http://img.shields.io/npm/v/ygor.svg?style=flat-square
[npm-url]:       https://npmjs.org/package/ygor
[travis-img]:    http://img.shields.io/travis/shannonmoeller/ygor/master.svg?style=flat-square
[travis-url]:    https://travis-ci.org/shannonmoeller/ygor
