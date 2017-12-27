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

<br />

[Ygor](http://npm.im/ygor) is a toolkit consisting of a [task runner](http://npm.im/@ygor/tasks) and a [file transformer](http://npm.im/@ygor/files). Enjoy as a whole or a la carte. Leaning heavily on [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises), Ygor works wonderfully with [`async` and `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) in Node.js 8 and above.

- [`ygor`](http://npm.im/ygor) - Entire toolkit.
- [`@ygor/tasks`](http://npm.im/@ygor/tasks) - Task runner
- [`@ygor/files`](http://npm.im/@ygor/files) - File transformer

<!--
## Toolkit

Using the toolkit looks something like this. Install [`ygor`](http://npm.im) with [npm](http://npm.im):

```sh
$ npm install --save-dev ygor
```

Create a JavaScript file with your tasks.

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

Then, execute the file with [Node.js](https://nodejs.org) (or with [babel-node](http://babeljs.io/docs/usage/cli/#babel-node) if that's how you roll).

```sh
$ node make js --minified
```

## Task Runner

If you only want to run tasks, you can install [`@ygor/tasks`](http://npm.im/@ygor/tasks) directly with [npm](http://npm.im).

```sh
$ npm install --save-dev @ygor/tasks
```

You can write some functions in a JavaScript file and tell Ygor about them.

```js
// make.js

const tasks = require('@ygor/tasks');

async function buildCss(cli) {
  // Your css task.
}

async function buildJs(cli) {
  // Your js task.
}

async function build(cli) {
  await buildCss(cli);
  await buildJs(cli);
}

tasks
  .add('css', buildCss)
  .add('js', buildJs)
  .add('default', build);
```

Then run the file with [Node](https://nodejs.org). Ygor will parse any arguments given with [minimist](http://npm.im/minimist) and pass them as an object to your task function.

```sh
$ node make css --minify  # runs `css` task with an argument
$ node make js            # runs `js` task
$ node make               # runs `default` task
```

See [`@ygor/tasks`](http://npm.im/@ygor/tasks) for complete documentation.

## File Transformer

If you only want to transform files, you can install [`@ygor/files`](http://npm.im/@ygor/files) directly with [npm](http://npm.im).

```sh
$ npm install --save-dev @ygor/files
```

You can find files that match a glob pattern and iterate over them with [promise array methods](http://npm.im/@ygor/list#api). There are also some helpers to read and write files.

```js
const { find, read, write } = require('@ygor/files');
const { transform } = require('babel-core');

find('src/**/*.js')
  .map(read())
  .map(file => {
    file.contents = transform(file.contents).code;

    return file;
  })
  .map(write('dest'));
```

See [`@ygor/files`](http://npm.im/@ygor/files) for complete documentation.
-->

----

© 2017 Shannon Moeller <me@shannonmoeller.com>

Licensed under [MIT](http://shannonmoeller.com/mit.txt)
