# @ygor/file

[![NPM version][npm-img]][npm-url] [![Downloads][downloads-img]][npm-url] [![Build Status][travis-img]][travis-url] [![Coverage Status][coveralls-img]][coveralls-url]

A no-frills file object. Built on [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) to work wonderfully with [`async` and `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) in Node.js 8 and above. Part of the [Ygor toolkit](https://github.com/shannonmoeller/ygor#readme).

## Install

```
$ npm install --save @ygor/file
```

## Usage

```js
const file = require('@ygor/file');
```

## API

### `file([options]): File`

- `options` `{Object}`
- `options.cwd` `{String}` - Current working directory. (default: `process.cwd()`)
- `options.path` `{String}` - Path to file after `cwd`. (default: `undefined`)
- `options.contents` `{String|Buffer}` - File contents. (default: `undefined`)

### File Properties

#### `.absolute`

#### `.cwd`

#### `.path`

#### `.dirname`

#### `.basename`

#### `.stem`

#### `.extname`

### File Methods

#### `.delete()`

#### `.read()`

#### `.stat()`

#### `.write()`
----

© 2017 Shannon Moeller <me@shannonmoeller.com> (shannonmoeller.com)

Licensed under [MIT](http://shannonmoeller.com/mit.txt)

[coveralls-img]: http://img.shields.io/coveralls/shannonmoeller/ygor/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/shannonmoeller/ygor
[downloads-img]: http://img.shields.io/npm/dm/@ygor/file.svg?style=flat-square
[npm-img]:       http://img.shields.io/npm/v/@ygor/file.svg?style=flat-square
[npm-url]:       https://npmjs.org/package/@ygor/file
[travis-img]:    http://img.shields.io/travis/shannonmoeller/ygor/master.svg?style=flat-square
[travis-url]:    https://travis-ci.org/shannonmoeller/ygor
