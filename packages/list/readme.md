# @ygor/list

[![NPM version][npm-img]][npm-url] [![Downloads][downloads-img]][npm-url] [![Build Status][travis-img]][travis-url] [![Coverage Status][coveralls-img]][coveralls-url]

An array-aware promise object. Like a regular [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises), but with asynchronous iteration methods. Works wonderfully with [`async` and `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) in Node.js 8 and above. Part of the [Ygor toolkit](https://github.com/shannonmoeller/ygor#readme).

## Install

```console
$ npm install --save @ygor/list
```

## Usage

```js
const list = require('@ygor/list');

const [foo, bar] = await list(['/foo', '/bar'])
  .map(url => fetch(url))
  .map(res => res.json());

console.log(foo);
console.log(bar);
```

## API

### `list(arr): List<any>`

- `arr` `{Array<Promise|any>,Promise<Array<Promise|any>>}` - An array of items, an array of promises, a promise for an array of items, or a promise for an array of promises.

Creates a List, an array-aware Promise object. Always resolves to a resolved array of resolved items.

### List Methods

#### `.then()` and `.catch()`

A List is just a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) with some extra methods, so the typical `.then()` and `.catch()` are here, plus the following.

#### `.filter(callback [, options]): List`

- `callback` `{Function(item, i)}` - Filter function.
- `options` `{Object}` - See [`p-filter` options](http://npm.im/p-filter#options).

Essentially [`Array.prototype.filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), but the callback may return a promise.

#### `.find(callback [, options]): List`

- `callback` `{Function(item, i)}` - Find function.
- `options` `{Object}` - See [`p-locate` options](http://npm.im/p-locate#options).

Essentially [`Array.prototype.find`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find), but the callback may return a promise.

#### `.first([count [, options]]): List`

- `count` `{Number}` - Number of items to await. (default: `1`)
- `options` `{Object}` - See [`p-some` options](http://npm.im/p-some#options).

Returns a List containing the first item or items that resolve.

```js
const delay = require('delay');

const items = [
  delay(20, 'foo'),
  delay(10, 'bar'),
  delay(40, 'baz'),
  delay(30, 'bat')
];

const first = await list(items).first();

console.log(first); // -> ['bar']

const firstTwo = await list(items).first(2);

console.log(firstTwo); // -> ['bar', 'foo']

const firstTwoB = await list(items).first(2, {
  filter: x => x.startsWith('b')
});

console.log(firstTwoB); // -> ['bar', 'bat']
```

#### `.flatMap(callback [, options]): List`

- `callback` `{Function(item, i)}` - Map function.
- `options` `{Object}` - See [`p-map` options](http://npm.im/p-map#options).

Convenience shorthand for `list.map(...).flatten()`.

#### `.flatten(): List`

Flattens an array of arrays into a single array. Useful when map functions return an unknown number of items that should result in the new list.

```js
const letters = await list(['a', 'b', 'c'])
    .map(x => [x, x.toUpperCase()])
    .flatten();

console.log(letters); // -> ['a', 'A', 'b', 'B', 'c', 'C']
```

#### `.map(callback [, options]): List`

- `callback` `{Function(item, i)}` - Map function.
- `options` `{Object}` - See [`p-map` options](http://npm.im/p-map#options).

Essentially [`Array.prototype.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map), but the callback may return a promise.

#### `.reduce(callback, initial [, options]): List`

- `callback` `{Function(item, i)}` - Map function.
- `initial` `any` - Initial value for reduction.
- `options` `{Object}` - See [`p-reduce` options](http://npm.im/p-reduce#options).

Essentially [`Array.prototype.reduce`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce), but the callback may return a promise. Also, the return value will always be an array, even if the initial value is not. This allows you to continue the chain.

```js
const number = await list([1, 2, 3])
    .reduce((a, b) => a + b, 0)
    .flatMap(x => [x, x * x]);

console.log(number); // -> [6, 36]
```

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
