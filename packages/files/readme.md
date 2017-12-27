# @ygor/files

[![NPM version][npm-img]][npm-url] [![Downloads][downloads-img]][npm-url]

[Ygor](https://github.com/shannonmoeller/ygor) is a toolkit consisting of a [task runner](http://npm.im/@ygor/tasks) and this file transformer. Enjoy as a whole or a la carte. Leaning heavily on [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises), Ygor works wonderfully with [`async` and `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) in Node.js 8 and above.

## Install

```
$ npm install --save @ygor/files
```

## Usage

```js
// make.js

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

## API

### `find()`

### `read()`

### `write()`

----

© 2017 Shannon Moeller <me@shannonmoeller.com> (shannonmoeller.com)

Licensed under [MIT](http://shannonmoeller.com/mit.txt)

[downloads-img]: http://img.shields.io/npm/dm/@ygor/files.svg?style=flat-square
[npm-img]:       http://img.shields.io/npm/v/@ygor/files.svg?style=flat-square
[npm-url]:       https://npmjs.org/package/@ygor/files
