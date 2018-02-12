<p align="center">
  <a href="https://github.com/shannonmoeller/ygor#readme"><img src="https://cdn.rawgit.com/shannonmoeller/ygor/4de4a22/media/logo.svg" alt="ygor" width="480" /></a>
</p>

<p align="center">
  For when <code>npm run</code> isn't enough and everything else is too much.
</p>

<p align="center">
  <a href="http://npm.im/ygor"><img src="https://img.shields.io/npm/v/ygor.svg?style=flat-square" alt="version" /></a>
  <a href="http://npm.im/ygor"><img src="https://img.shields.io/npm/dm/ygor.svg?style=flat-square" alt="downloads" /></a>
  <a href="https://travis-ci.org/shannonmoeller/ygor"><img src="http://img.shields.io/travis/shannonmoeller/ygor.svg?style=flat-square" alt="build status" /></a>
  <a href="https://coveralls.io/r/shannonmoeller/ygor"><img src="http://img.shields.io/coveralls/shannonmoeller/ygor/master.svg?style=flat-square" alt="coverage status" /></a>
</p>

<br />

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

const { tasks, shell, find, read, write } = require('ygor');
const { transform } = require('babel-core');

function buildCss() {
  return shell`postcss --use autoprefixer --dir dest src/**/*.css`;
}

function buildJs(cli) {
  return find('src/**/*.js')
    .map(read())
    .map(file => {
      const { code } = await transform(file.contents, cli);

      file.contents = code;

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

See the individual packages for complete documentation:

- [`@ygor/tasks`](http://npm.im/@ygor/tasks) - Task runner
- [`@ygor/shell`](http://npm.im/@ygor/shell) - Shell template tag
- [`@ygor/files`](http://npm.im/@ygor/files) - File transformer
- [`@ygor/file`](http://npm.im/@ygor/file) - Virtual file object
- [`@ygor/list`](http://npm.im/@ygor/list) - Array-aware Promise

----

MIT © [Shannon Moeller](http://shannonmoeller.com)

[coveralls-img]: http://img.shields.io/coveralls/shannonmoeller/ygor/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/shannonmoeller/ygor
[downloads-img]: http://img.shields.io/npm/dm/ygor.svg?style=flat-square
[npm-img]:       http://img.shields.io/npm/v/ygor.svg?style=flat-square
[npm-url]:       https://npmjs.org/package/ygor
[travis-img]:    http://img.shields.io/travis/shannonmoeller/ygor/master.svg?style=flat-square
[travis-url]:    https://travis-ci.org/shannonmoeller/ygor
