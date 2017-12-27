# @ygor/tasks

[![NPM version][npm-img]][npm-url] [![Downloads][downloads-img]][npm-url]

[Ygor](http://npm.im/ygor) is a toolkit consisting of this task runner and a [file transformer](http://npm.im/@ygor/files). Enjoy as a whole or a la carte. Leaning heavily on [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises), Ygor works wonderfully with [`async` and `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) in Node.js 8 and above.

## Install

```
$ npm install --save @ygor/tasks
```

## Usage

Node is the CLI.

```
$ node <file> [task] [options]

  file   The filename of your script.
  task   The name of the task to run (default: 'default').

Options

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

```
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

```
$ node make a 2
hi from a2

$ node make b 1
hi from b1
```

## API

### `tasks.cli`

Command-line arguments as parsed by [minimist](http://npm.im/minimist).

### `tasks.add(name, callback) : ygor`

- `name` `{String}` Unique task identifier.
- `callback` `{Function(cli, tasks)}` Function to run when the task is invoked.

Registers a task with Ygor. The callback provided will be executed with `tasks.cli` as the first argument and `tasks` as the second.

```js
function foo(cli, tasks) {
    console.log(cli, tasks);
}

tasks.add('foo', foo);
```

### `tasks.run(name) : Promise`

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


----

© 2017 Shannon Moeller <me@shannonmoeller.com> (shannonmoeller.com)

Licensed under [MIT](http://shannonmoeller.com/mit.txt)

[downloads-img]: http://img.shields.io/npm/dm/@ygor/tasks.svg?style=flat-square
[npm-img]:       http://img.shields.io/npm/v/@ygor/tasks.svg?style=flat-square
[npm-url]:       https://npmjs.org/package/@ygor/tasks
