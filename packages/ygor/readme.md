# ygor

[![NPM version][npm-img]][npm-url] [![Downloads][downloads-img]][npm-url]

[Ygor](https://github.com/shannonmoeller/ygor) is a toolkit consisting of a [task runner](http://npm.im/@ygor/tasks) and a [file transformer](http://npm.im/@ygor/files). Enjoy as a whole or a la carte. Leaning heavily on [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises), Ygor works wonderfully with [`async` and `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) in Node.js 8 and above.

## Install

```
$ npm install --save-dev ygor
```

## Example

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

To run a task, execute the file with [Node.js](https://nodejs.org) (or with [babel-node](http://babeljs.io/docs/usage/cli/#babel-node) if that's how you roll) and indicate which task to perform. Ygor will parse any arguments given with [minimist](http://npm.im/minimist) and pass them as an object to the task function.

```sh
$ node make js --minified
```

## API

See [`@ygor/tasks`](http://npm.im/@ygor/tasks) for complete documentation on the task runner (`tasks`).

See [`@ygor/files`](http://npm.im/@ygor/files) for complete documentation on the file transformer (`find`, `read`, `write`).

----

© 2017 Shannon Moeller <me@shannonmoeller.com> (shannonmoeller.com)

Licensed under [MIT](http://shannonmoeller.com/mit.txt)

[downloads-img]: http://img.shields.io/npm/dm/ygor.svg?style=flat-square
[npm-img]:       http://img.shields.io/npm/v/ygor.svg?style=flat-square
[npm-url]:       https://npmjs.org/package/ygor
