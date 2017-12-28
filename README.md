# Bolt

> Super-powered JavaScript project management

### Introduction

Find it difficult to manage lots of components, libraries, or services?
Juggling lots of Node packages in lots of different repositories? What if there
was a better way?

![Diagram: One package per project](https://raw.githubusercontent.com/boltpkg/assets/master/diagram-multirepo.png)

Most JavaScript projects have 1 package per project (repo). So when you have
lots of packages, you have to do a lot of work to manage them all.

- You need to install every single package one by one.
- If you make changes to one package and want to test them in another, you need
  to manually link them together and run tests separately.
- Managing dependencies and keeping everything up to date can be overwhelming,
  and you can easily fall really far behind.

Instead of all that, what if you put all of your packages together?

![Diagram: Project with many packages](https://raw.githubusercontent.com/boltpkg/assets/master/diagram-monorepo.png)

This is the idea behind "workspaces".

#### What are workspaces?

Within a project, a workspace is just a directory with its own `package.json`.

```
project
├── package.json
├── workspace-one
│   ├── package.json
│   └── index.js
└── workspace-two
    ├── package.json
    └── index.js
```

Put another way, workspaces are just like any other package, except they are
nested within a larger project. Each workspace can have its own dependencies
with its own code and scripts.

Using Bolt, you can install the dependencies for all of these packages at once
(and you can do it really really fast).

But here's where it gets really cool: When you specify a dependency from one
workspace to another. It will get linked to the actual source. This way, when
you go to test your code. All your changes get tested together.

#### What is Bolt?

Bolt implements the idea of workspaces on top of [Yarn](https://yarnpkg.com/).
In fact, the Bolt CLI is largely a drop-in replacement of the Yarn CLI. You can
use it on any project already using Yarn.

But Bolt (will soon) do lots of other stuff. Instead of wasting tons of time
setting up a whole bunch of build tools for running your tests, or compiling
your code, what if your package manager just did all that for you? Then when
you want to do something differently, all you need to do is override a script.

Well that's what Bolt will do for you (once we get around to implementing it).

Long term, many of the features in Bolt will hopefully prove to be useful and
other package managers like [Yarn](https://yarnpkg.com/) and
[npm](https://www.npmjs.com/) will adopt them.

## Installation

First be sure that you have [Node/npm](https://nodejs.org/) and
[Yarn](https://yarnpkg.com/docs/install/) installed. Then run the following
command:

```sh
yarn global add bolt
```

> Thanks to Cam Pedersen ([@ecto](https://github.com/ecto)) for the "bolt"
> package name on npm

## Commands

> **Note:** Bolt is under active development and some of these commands have
> not yet been implemented.

| Command                                 | Description                                                               | Status |
| --------------------------------------- | ------------------------------------------------------------------------- |--------|
| `bolt`                                  | (Defaults to `bolt install`)                                              |✅|
| `bolt [unknown command]`                | (Defaults to `bolt run [unknown command]`)                                |✅|
| `bolt help`                             | View Bolt's help content                                                  |❌|
| `bolt help [command]`                   | View Bolt's help content for a single command                             |❌|
| `bolt init`                             | Create a new Bolt package in the current directory                        |✅|
| └ `bolt init --yes`                     | Skip the prompts and use defaults                                         |❌|
| `bolt install`                          | Install all the dependencies for a project                                |✅|
| `bolt add [dependency]`                 | Add a dependency                                                          |✅|
| `bolt upgrade [dependency]`             | Upgrade a dependency                                                      |❌|
| `bolt version`                          | Updates the version of your package(s)                                    |✅|
| `bolt publish`                          | Publish new version(s) of your package(s) to npm                          |✅|
| └ `bolt publish-lock`                   | Lock your package(s) on the npm registry                                  |✅|
| └ `bolt publish-unlock`                 | Unlock your package(s) on the npm registry                                |✅|
| `bolt run [script]`                     | Run a script in a package                                                 |✅|
| `bolt build`                            | Build your package(s) (Default: Babel)                                    |🖌|
| `bolt test`                             | Test your package(s) (Default: Jest)                                      |🖌|
| `bolt format/fmt`                       | Format the files in your package(s) (Default: Prettier)                   |🖌|
| `bolt lint`                             | Lint your package(s) (Default: ESLint)                                    |🖌|
| `bolt doc`                              | Generate docs (Default: Documentation.js)                                 |🖌|
| `bolt check`                            | Type check your package(s) (Default: Flow)                                |🖌|
| `bolt bin`                              | Print the folder where executable files for the package will be installed |✅|
| `bolt workspaces/ws`                    | **Run the following commands across all workspaces:**                     ||
| └ `bolt ws run [script]`                | Run a script in every package                                             |✅|
| └ `bolt ws upgrade [dependency]`        | Upgrade a dependency from every package that depends on it                |❌|
| └ `bolt ws remove [dependency]`         | Remove a dependency from every package that depends on it                 |✅|
| └ `bolt ws ... --only [name glob]`      | Filter workspaces by name                                                 |❌|
| └ `bolt ws ... --ignore [name glob]`    | Filter out workspaces by name                                             |❌|
| └ `bolt ws ... --only-fs [file glob]`   | Filter workspaces by file path                                            |❌|
| └ `bolt ws ... --ignore-fs [file glob]` | Filter out workspaces by file path                                        |❌|
| `bolt workspace/w [name]`               | **Run the following commands on a single workspace:**                     ||
| └ `bolt w [name] run [script]`          | Run a script in a single workspace                                        |✅|
| └ `bolt w [name] add [dependency]`      | Add a dependency to a single workspace                                    |✅|
| └ `bolt w [name] upgrade [dependency]`  | Upgrade a dependency in a single workspace                                |❌|
| `bolt project/p`                        | **Run the following commands on your project package:**                   ||
| └ `bolt p run [script]`                 | Run a script on the project package                                       |✅|
| └ `bolt p add [dependency]`             | Add a dependency to the project package                                   |❌|
| └ `bolt p remove [dependency]`          | Remove a dependency from the project package                              |✅|
| └ `bolt p upgrade [dependency]`         | Upgrade a dependency on the project package                               |❌|
| `bolt generate/g [generator]`           | **Create files in your package using a generator:**                       ||
| └ `bolt g license [license]`            | Create a LICENSE file in your package (Default: MIT)                      |❌|
