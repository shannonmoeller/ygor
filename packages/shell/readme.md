# @ygor/file

[![NPM version][npm-img]][npm-url] [![Downloads][downloads-img]][npm-url] [![Build Status][travis-img]][travis-url] [![Coverage Status][coveralls-img]][coveralls-url]

A no-frills shell template tag. Built on [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) to work wonderfully with [`async` and `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) in Node.js 8 and above. Part of the [Ygor toolkit](https://github.com/shannonmoeller/ygor#readme).

## Install

```console
$ npm install --save @ygor/file
```

## Usage

```js
const shell = require('@ygor/shell');

const foo = 'hello world';
const bar = 'goodnight moon';

await shell`
    echo ${foo}
    >&2 echo ${bar}
`;

const result = await shell({ stdio: 'pipe' })`
    echo ${foo}
    >&2 echo ${bar}
`;

console.log(result.stdout, result.stderr);
```

## API

### shell`` `cmd` ``: Promise

- `cmd` `{String}`

Interpolates a string, escapes values to make them safe to run in the shell, then executes the command. Supports multi-line commands. Directs `stdout` and `stderr` to the parent process.

```js
await shell`
    echo ${foo}
    >&2 echo ${bar}
`;

try {
  await shell`exit 123`;
} catch (e) {
  console.error(`Exited with code: ${e.code}`);
}
```

### shell([options]): Function(strings, ...values): Promise

- `options` `{Object}` - See [`execa` options](https://github.com/sindresorhus/execa#options).

Creates a template-tag function with the given options. Useful for overriding things like the current working directory or how `stdio` is handled.

```js
const shellPipe = shell({ stdio: 'pipe' });
const process = shellPipe`echo hello world`;

process.stdout.pipe(process.stdout);

console.log(await process);
```

----

© 2017 Shannon Moeller <me@shannonmoeller.com> (shannonmoeller.com)

Licensed under [MIT](http://shannonmoeller.com/mit.txt)

[coveralls-img]: http://img.shields.io/coveralls/shannonmoeller/ygor/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/shannonmoeller/ygor
[downloads-img]: http://img.shields.io/npm/dm/@ygor/shell.svg?style=flat-square
[npm-img]:       http://img.shields.io/npm/v/@ygor/shell.svg?style=flat-square
[npm-url]:       https://npmjs.org/package/@ygor/shell
[travis-img]:    http://img.shields.io/travis/shannonmoeller/ygor/master.svg?style=flat-square
[travis-url]:    https://travis-ci.org/shannonmoeller/ygor
