# @ygor/tasks

[![NPM version][npm-img]][npm-url] [![Downloads][downloads-img]][npm-url] [![Build Status][travis-img]][travis-url] [![Coverage Status][coveralls-img]][coveralls-url]

A no-frills task runner. Built on [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) to work wonderfully with [`async` and `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) in Node.js 8 and above. Part of the [Ygor toolkit](https://github.com/shannonmoeller/ygor#readme).

Node is the CLI, npm is the plugin system. Go nuts.

## Install

```console
$ npm install --save-dev @ygor/tasks
```

## Usage

Node is the CLI.

```man
Usage: node <file> [task] [options]

  file   The filename of your script.
  task   The name of the task to run (default: 'default').

Options:

  -q, --quiet   Suppress logging (default: false).
      --run     Auto-run task (default: true).
```

Create a JavaScript file, write some functions, tell Ygor.

```js
// make.js

const tasks = require('@ygor/tasks');

async function bundle() {
    // bundle something
}

async function instrument() {
    // instrument tests
}

async function test() {
    // test something
}

async function cover() {
    await instrument();
    await test();

    // report coverage
}

tasks
    .add('default', bundle)
    .add('test', test);
    .add('cover', cover);
```

To run a task, execute the file with [Node.js](https://nodejs.org) (or with [babel-node](http://babeljs.io/docs/usage/cli/#babel-node) if that's how you roll) and indicate which task to perform.

```console
$ node make
$ node make test
$ node make cover
```

### Deferred Tasks

If you need to define tasks asynchronously, you may call `tasks` as a function at a later time.

```js
ToolsApi
    .getTools()
    .then(tools => {
        return tasks()
            .add('foo', tools.foo)
            .add('bar', tools.bar);
    });
```

### Subtasks

You may also call `tasks()` within a task callback to create subtasks.

```js
function childA1() { console.log('hi from a1'); }
function childA2() { console.log('hi from a2'); }

function parentA() {
    // Subtasks
    return tasks()
        .add('1', childA1)
        .add('2', childA2);
}

function childB1() { console.log('hi from b1'); }
function childB2() { console.log('hi from b2'); }

function parentB() {
    // Subtasks
    return tasks()
        .add('1', childB1)
        .add('2', childB2);
}

tasks
    .add('a', parentA)
    .add('b', parentB);
```

Then execute subtasks by passing the parent task name as the first argument and the child task name as the second.

```console
$ node make a 2
hi from a2

$ node make b 1
hi from b1
```

### Bring Your Own Arguments

You can override the default cli parsing by providing your own arguments object.

```js
function logCli(cli) {
    console.log(cli);
}

tasks({ foo: 'bar' })
    .add('log', logCli);
```

```console
$ node make log
{ foo: 'bar' }
```

## API

### `tasks.cli`

Command-line arguments as parsed by [minimist](http://npm.im/minimist).

### `tasks.add(name, callback): tasks`

- `name` `{String}` Unique task identifier.
- `callback` `{Function(cli, tasks)}` Function to run when the task is invoked.

Registers a task with Ygor. The callback provided will be executed with `tasks.cli` as the first argument and `tasks` as the second.

```js
function foo(cli, tasks) {
    console.log(cli, tasks);
}

tasks.add('foo', foo);
```

### `tasks.run(name): Promise<>`

- `name` `{String}` Unique task identifier.

Tells Ygor to run a task. This is used internally and generally shouldn't be invoked directly. Ygor recommends that tasks be declared as standalone functions.

```js
// Avoid

tasks.add('foo', function () {
    // do something
});

tasks.add('bar', function (cli, t) {
    t.run('foo');
});

// Recommended

function foo() {
    // do something
}

function bar() {
    foo();
}

tasks
    .add('foo', foo)
    .add('bar', bar);
```

### `tasks([cli]): tasks`

- `options` `{Object}` - The `cli` arguments. (default: `minimist(process.argv.slice(2))`)

Creates a subset of tasks, useful for providing your own cli arguments, [lazy task definition](#deferred-tasks), and [creating subtasks](#subtasks).

----

<p align="center">
  <a href="https://github.com/shannonmoeller/ygor#readme"><img src="https://cdn.rawgit.com/shannonmoeller/ygor/4de4a22/media/logo.svg" alt="ygor" width="480" /></a>
</p>

----

MIT © [Shannon Moeller](http://shannonmoeller.com)

[coveralls-img]: http://img.shields.io/coveralls/shannonmoeller/ygor/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/shannonmoeller/ygor
[downloads-img]: http://img.shields.io/npm/dm/@ygor/tasks.svg?style=flat-square
[npm-img]:       http://img.shields.io/npm/v/@ygor/tasks.svg?style=flat-square
[npm-url]:       https://npmjs.org/package/@ygor/tasks
[travis-img]:    http://img.shields.io/travis/shannonmoeller/ygor/master.svg?style=flat-square
[travis-url]:    https://travis-ci.org/shannonmoeller/ygor
