# @ygor/file

[![NPM version][npm-img]][npm-url] [![Downloads][downloads-img]][npm-url] [![Build Status][travis-img]][travis-url] [![Coverage Status][coveralls-img]][coveralls-url]

A no-frills file object. Built on [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) to work wonderfully with [`async` and `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) in Node.js 8 and above. Part of the [Ygor toolkit](https://github.com/shannonmoeller/ygor#readme).

## Install

```console
$ npm install --save @ygor/file
```

## Usage

```js
const file = require('@ygor/file');

const foo = file({ path: 'foo/bar.txt' });

console.log(foo.absolute);
// -> /home/jdoe/foo/bar.txt

// Read the contents of the file at the given path.
await foo.read();

// Modify the contents in memory.
file.contents = file.contents.toUpperCase();

// Write the new contents to the file system.
await foo.write();
```

## API

### `file([options]): File`

- `options` `{Object}`
- `options.cwd` `{String}` - Current working directory. (default: `process.cwd()`)
- `options.path` `{String}` - Path to file relative to `.cwd`. (default: `undefined`)
- `options.contents` `{String|Buffer}` - File contents. (default: `undefined`)
- `options.[custom]` `{any}` - Any additional properties will be copied to the returned File object.

Creates a File object.

### File Methods

#### `.delete(): Promise<File>`

Unlinks the file on the file system. The contents remain in memory if they were set or read.

#### `.read([options]): Promise<File>`

- `options` `{Object}` - Same as [`fs.readFile` options](https://nodejs.org/dist/latest-v8.x/docs/api/fs.html#fs_fs_readfile_path_options_callback) with the following change.
- `options.encoding` `{String|null}` - File encoding defaults to `utf8`. You must specify `null` for binary files. (default: `'utf8'`)

Reads the file contents from the file system into the `.contents` value.

#### `.stat(): Promise<Stats>`

Returns an instance of the Node.js [fs.Stats class](https://nodejs.org/dist/latest-v8.x/docs/api/fs.html#fs_class_fs_stats).

#### `.write([options]): Promise<File>`

- `options` `{Object}` - Same as [`fs.writeFile` options](https://nodejs.org/dist/latest-v8.x/docs/api/fs.html#fs_fs_writefile_file_data_options_callback) with the following addition.
- `options.cwd` `{String}` Alternate base path for the write; can be relative to the existing `.cwd` or an absolute path.

Writes the `.contents` value as the file contents to the file system.

#### `.toJSON(): Object`

Returns `.cwd`, `.path`, and `.contents` as a plain object.

#### `.toString(): String`

Returns a `console.log`-friendly representation of the file.

### File Properties

#### `.contents` `{String|Buffer|undefined}`

The contents of the file.

#### `.absolute` `{String}`

The absolute path to the file. Read only.

```js
const foo = file({ path: 'foo/bar.txt' });

console.log(foo.absolute);
// -> /home/jdoe/foo/bar.txt
```

#### `.cwd` `{String}`

The current working directory of the file. (default `process.cwd()`)

```js
const foo = file({ path: 'foo/bar.txt' });

console.log(foo.absolute);
// -> /home/jdoe/foo/bar.txt

console.log(foo.cwd);
// -> /home/jdoe

foo.cwd = '/Users/jappleseed';

console.log(foo.absolute);
// -> /Users/jappleseed/foo/bar.txt
```

#### `.path` `{String}`

The path of the file relative to `.cwd`.

```js
const foo = file({ path: 'foo/bar.txt' });

console.log(foo.absolute);
// -> /home/jdoe/foo/bar.txt

console.log(foo.path);
// -> foo/bar.txt

foo.path = 'baz/qux.txt';

console.log(foo.absolute);
// -> /home/jdoe/baz/qux.txt
```

#### `.dirname` `{String}`

The directory portion of `.path`.

```js
const foo = file({ path: 'foo/bar.txt' });

console.log(foo.absolute);
// -> /home/jdoe/foo/bar.txt

console.log(foo.dirname);
// -> foo

foo.dirname = 'baz/qux';

console.log(foo.absolute);
// -> /home/jdoe/baz/qux/bar.txt
```

#### `.basename` `{String}`

The file portion of `.path`.

```js
const foo = file({ path: 'foo/bar.txt' });

console.log(foo.absolute);
// -> /home/jdoe/foo/bar.txt

console.log(foo.basename);
// -> bar.txt

foo.basename = 'qux.txt';

console.log(foo.absolute);
// -> /home/jdoe/foo/qux.txt
```

#### `.stem` `{String}`

The file portion of `.path` without the extension.

```js
const foo = file({ path: 'foo/bar.txt' });

console.log(foo.absolute);
// -> /home/jdoe/foo/bar.txt

console.log(foo.stem);
// -> bar

foo.stem = 'qux';

console.log(foo.absolute);
// -> /home/jdoe/foo/qux.txt
```

#### `.extname` `{String}`

The file extension portion of `.path`.

```js
const foo = file({ path: 'foo/bar.txt' });

console.log(foo.absolute);
// -> /home/jdoe/foo/bar.txt

console.log(foo.extname);
// -> .txt

foo.extname = '.html';

console.log(foo.absolute);
// -> /home/jdoe/foo/bar.html
```

#### `.history` `{Array<String>}`

The history of `.path` changes. Generally best treated as read-only.

```js
const foo = file({ path: 'foo/bar.txt' });

console.log(foo.history);
// -> ['foo/bar.txt']

foo.stem = 'qux';

console.log(foo.history);
// -> ['foo/bar.txt', 'foo/qux.txt']
```

----

<p align="center">
  <a href="https://github.com/shannonmoeller/ygor#readme"><img src="https://cdn.rawgit.com/shannonmoeller/ygor/4de4a22/media/logo.svg" alt="ygor" width="480" /></a>
</p>

----

MIT © [Shannon Moeller](http://shannonmoeller.com)

[coveralls-img]: http://img.shields.io/coveralls/shannonmoeller/ygor/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/shannonmoeller/ygor
[downloads-img]: http://img.shields.io/npm/dm/@ygor/file.svg?style=flat-square
[npm-img]:       http://img.shields.io/npm/v/@ygor/file.svg?style=flat-square
[npm-url]:       https://npmjs.org/package/@ygor/file
[travis-img]:    http://img.shields.io/travis/shannonmoeller/ygor/master.svg?style=flat-square
[travis-url]:    https://travis-ci.org/shannonmoeller/ygor
