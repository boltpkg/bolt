# Bolt

Bolt is a super-powered wrapper around [Yarn](https://yarnpkg.com/) and
[npm](https://www.npmjs.com/) that provides you with useful commands for
working with your projects. The hope in the future is that a lot of these ideas
will make it back into Yarn and/or npm.

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

| Command                                  | Description                                                |
| ---------------------------------------- | ---------------------------------------------------------- |
| `bolt`                                  | (Defaults to `bolt install`)                               |
| `bolt [unknown command]`                | (Defaults to `bolt run [unknown command]`)                 |
| `bolt help`                             | View Bolt's help content                                   |
| `bolt help [command]`                   | View Bolt's help content for a single command              |
| `bolt init`                             | Create a new Bolt package in the current directory         |
| └ `bolt init --yes`                     | Skip the prompts and use defaults                          |
| `bolt install`                          | Install all the dependencies for a project                 |
| `bolt add [dependency]`                 | Add a dependency                                           |
| `bolt upgrade [dependency]`             | Upgrade a dependency                                       |
| `bolt version`                          | Updates the version of your package(s)                     |
| `bolt publish`                          | Publish new version(s) of your package(s) to npm           |
| └ `bolt publish-lock`                   | Lock your package(s) on the npm registry                   |
| └ `bolt publish-unlock`                 | Unlock your package(s) on the npm registry                 |
| `bolt run [script]`                     | Run a script in a package                                  |
| `bolt build`                            | Build your package(s) (Default: Babel)                     |
| `bolt test`                             | Test your package(s) (Default: Jest)                       |
| `bolt format/fmt`                       | Format the files in your package(s) (Default: Prettier)    |
| `bolt lint`                             | Lint your package(s) (Default: ESLint)                     |
| `bolt doc`                              | Generate docs (Default: Documentation.js)                  |
| `bolt check`                            | Type check your package(s) (Default: Flow)                 |
| `bolt workspaces/ws`                    | **Run the following commands across all workspaces:**      |
| └ `bolt ws run [script]`                | Run a script in every package                              |
| └ `bolt ws upgrade [dependency]`        | Upgrade a dependency from every package that depends on it |
| └ `bolt ws remove [dependency]`         | Remove a dependency from every package that depends on it  |
| └ `bolt ws ... --only [name glob]`      | Filter workspaces by name                                  |
| └ `bolt ws ... --ignore [name glob]`    | Filter out workspaces by name                              |
| └ `bolt ws ... --only-fs [file glob]`   | Filter workspaces by file path                             |
| └ `bolt ws ... --ignore-fs [file glob]` | Filter out workspaces by file path                         |
| `bolt workspace/w [name]`               | **Run the following commands on a single workspace:**      |
| └ `bolt w [name] run [script]`          | Run a script in a single workspace                         |
| └ `bolt w [name] add [dependency]`      | Add a dependency to a single workspace                     |
| └ `bolt w [name] upgrade [dependency]`  | Upgrade a dependency in a single workspace                 |
| `bolt project/p`                        | **Run the following commands on your project package:**    |
| └ `bolt p run [script]`                 | Run a script on the project package                        |
| └ `bolt p add [dependency]`             | Add a dependency to the project package                    |
| └ `bolt p remove [dependency]`          | Remove a dependency from the project package               |
| └ `bolt p upgrade [dependency]`         | Upgrade a dependency on the project package                |
| `bolt generate/g [generator]`           | **Create files in your package using a generator:**        |
| └ `bolt g license [license]`            | Create a LICENSE file in your package (Default: MIT)       |
