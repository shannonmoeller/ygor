# @ygor/files

[![NPM version][npm-img]][npm-url] [![Downloads][downloads-img]][npm-url] [![Build Status][travis-img]][travis-url] [![Coverage Status][coveralls-img]][coveralls-url]

A no-frills file transformer. Built on [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) to work wonderfully with [`async` and `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) in Node.js 8 and above. Part of the [Ygor toolkit](https://github.com/shannonmoeller/ygor#readme).

Node is the CLI, npm is the plugin system. Go nuts.

## Install

```console
$ npm install --save-dev @ygor/files
```

## Usage

```js
const { find, read, write } = require('@ygor/files');
const { transform } = require('babel-core');

find('src/**/*.js')
  .map(read())
  .map(async file => {
    const { code } = await transform(file.contents);

    file.contents = code;

    return file;
  })
  .map(write('dest'))
  .then(console.log);
```

## API

### `find(patterns [, options]): List<File>`

- `patterns` `{String,Array<String>}` - See [`minimatch` glob patterns](https://github.com/isaacs/minimatch#usage).
- `options` `{Object}` - See [`globby` options](https://github.com/sindresorhus/globby#options).

Finds files on the file system by the given glob patterns. The results are returned as an array-aware promise ([`List`](http://npm.im/@ygor/list)) of virtual file objects ([`File`](http://npm.im/@ygor/file)).

```js
const files = await find('**/*.js');
```

### `read([options]): Function(File): File`

- `options` `{String|null|Object}` File encoding, or [`fs.readFile` options](https://nodejs.org/dist/latest-v8.x/docs/api/fs.html#fs_fs_readfile_path_options_callback). (default: `'utf8'`)

Creates a helper to read the contents of a given [`File`](http://npm.im/@ygor/file) object from the file system. Useful as a map function on a list of files.

```js
const files = await find('**/*.js')
    .map(read());
```

```js
const files = await find('**/*.js')
    // Same as above
    .map(read('utf8'));
```

```js
const files = await find('**/*.png')
    // Use `null` to read binary files
    .map(read(null));
```

```js
const files = await find('**/*.png')
    // fs.readFile options object
    .map(read({
        encoding: null,
        flag: 'r'
    }));
```

### `write([options]): Function(File): File`

- `options` `{String|Object}` Destination directory (relative to the original location or an absolute path), or [`fs.writeFile` options](https://nodejs.org/dist/latest-v8.x/docs/api/fs.html#fs_fs_writefile_file_data_options_callback). (default: `'.'`)

Creates a helper to write the contents of a given [`File`](http://npm.im/@ygor/file) object to the file system. Useful as a map function on a list of files.

```js
const files = await find('**/*.js')
    .map(read())
    // Overwrite original file
    .map(write());
```

```js
const files = await find('**/*.js')
    .map(read())
    // Copy file to new location
    .map(write('dest'));
```

```js
const files = await find('**/*.js')
    .map(read())
    // fs.writeFile options object
    .map(write({
        cwd: 'dest',
        flag: 'w'
    }));
```

----

<p align="center">
  <a href="https://github.com/shannonmoeller/ygor#readme"><img src="https://cdn.rawgit.com/shannonmoeller/ygor/4de4a22/media/logo.svg" alt="ygor" width="480" /></a>
</p>

----

© 2017 Shannon Moeller <me@shannonmoeller.com> (shannonmoeller.com)

Licensed under [MIT](http://shannonmoeller.com/mit.txt)

[coveralls-img]: http://img.shields.io/coveralls/shannonmoeller/ygor/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/shannonmoeller/ygor
[downloads-img]: http://img.shields.io/npm/dm/@ygor/files.svg?style=flat-square
[npm-img]:       http://img.shields.io/npm/v/@ygor/files.svg?style=flat-square
[npm-url]:       https://npmjs.org/package/@ygor/files
[travis-img]:    http://img.shields.io/travis/shannonmoeller/ygor/master.svg?style=flat-square
[travis-url]:    https://travis-ci.org/shannonmoeller/ygor
