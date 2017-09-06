# pyarn

pyarn is a super-powered wrapper around [Yarn](https://yarnpkg.com/) and
[npm](https://www.npmjs.com/) that provides you with useful commands for
working with your projects. The hope in the future is that a lot of these ideas
will make it back into Yarn and/or npm.

## Installation

First be sure that you have [Node/npm](https://nodejs.org/) and [Yarn](https://yarnpkg.com/docs/install/) installed. Then run the following command:

```sh
yarn global add pyarn
```

## Commands

> **Note:** pyarn is under active development and some of these commands have
> not yet been implemented.

| Command                                  | Description                                                |
| ---------------------------------------- | ---------------------------------------------------------- |
| `pyarn`                                  | (Defaults to `pyarn install`)                              |
| `pyarn [unknown command]`                | (Defaults to `pyarn run [unknown command]`)                |
| `pyarn help`                             | View pyarn's help content                                  |
| `pyarn help [command]`                   | View pyarn's help content for a single command             |
| `pyarn init`                             | Create a new pyarn package in the current directory        |
| └ `pyarn init --yes`                     | Skip the prompts and use defaults                          |
| `pyarn install`                          | Install all the dependencies for a project                 |
| `pyarn add [dependency]`                 | Add a dependency                                           |
| `pyarn upgrade [dependency]`             | Upgrade a dependency                                       |
| `pyarn version`                          | Updates the version of your package(s)                     |
| `pyarn publish`                          | Publish new version(s) of your package(s) to npm           |
| └ `pyarn publish-lock`                   | Lock your package(s) on the npm registry                   |
| └ `pyarn publish-unlock`                 | Unlock your package(s) on the npm registry                 |
| `pyarn run [script]`                     | Run a script in a package                                  |
| `pyarn build`                            | Build your package(s) (Default: Babel)                     |
| `pyarn test`                             | Test your package(s) (Default: Jest)                       |
| `pyarn format/fmt`                       | Format the files in your package(s) (Default: Prettier)    |
| `pyarn lint`                             | Lint your package(s) (Default: ESLint)                     |
| `pyarn doc`                              | Generate docs (Default: Documentation.js)                  |
| `pyarn check`                            | Type check your package(s) (Default: Flow)                 |
| `pyarn workspaces/ws`                    | **Run the following commands across all workspaces:**      |
| └ `pyarn ws run [script]`                | Run a script in every package                              |
| └ `pyarn ws upgrade [dependency]`        | Upgrade a dependency from every package that depends on it |
| └ `pyarn ws remove [dependency]`         | Remove a dependency from every package that depends on it  |
| └ `pyarn ws ... --only [name glob]`      | Filter workspaces by name                                  |
| └ `pyarn ws ... --ignore [name glob]`    | Filter out workspaces by name                              |
| └ `pyarn ws ... --only-fs [file glob]`   | Filter workspaces by file path                             |
| └ `pyarn ws ... --ignore-fs [file glob]` | Filter out workspaces by file path                         |
| `pyarn workspace/w [name]`               | **Run the following commands on a single workspace:**      |
| └ `pyarn w [name] run [script]`          | Run a script in a single workspace                         |
| └ `pyarn w [name] add [dependency]`      | Add a dependency to a single workspace                     |
| └ `pyarn w [name] upgrade [dependency]`  | Upgrade a dependency in a single workspace                 |
| `pyarn project/p`                        | **Run the following commands on your project package:**    |
| └ `pyarn p run [script]`                 | Run a script on the project package                        |
| └ `pyarn p add [dependency]`             | Add a dependency to the project package                    |
| └ `pyarn p remove [dependency]`          | Remove a dependency from the project package               |
| └ `pyarn p upgrade [dependency]`         | Upgrade a dependency on the project package                |
