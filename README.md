# pyarn

This package implements the public api of Yarn Workspaces using a stripped down
install process.

pyarn gets around having to implement the entire Yarn Workspace install process
using the following rules:

1. You MUST specify ALL your dependencies in the **project** `package.json` in
  addition to the **workspace** `package.json`
2. Dependencies installed in multiple workspaces MUST depend on the same
  version.

For example, if you have two workspaces that both depend on `react`, you must
add `react` to the root project `package.json` and they must all be on the same
version (i.e. `^15.5.1`).

You can still version workspaces independently and have different sets of
dependencies in each workspace.

## Installation

```sh
yarn global add pyarn
```

## Usage

Create a repo that looks like this:

```
project/
  package.json
  packages/
    foo/
      package.json
    bar/
      package.json
```

In the root project `package.json`, you should specify a `pworkspaces` field
like this:

```json
{
  "name": "project",
  "pworkspaces": [
    "packages/*"
  ]
}
```

Add a dependency to both the project `package.json` and a workspace
`package.json`.

```js
{
  "dependencies": {
    "react": "^15.5.1"
  }
}
```

Finally run `pyarn install` and you should get the proper `node_modules`.

```
pyarn install v0.1.0
[1/3] Installing project dependencies...
----------------------------------------
yarn install v0.27.5
info No lockfile found.
[1/4] Resolving packages...
[2/4] Fetching packages...
[3/4] Linking dependencies...
[4/4] Building fresh packages...
success Saved lockfile.
Done in 0.84s.
----------------------------------------
[2/3] Linking workspace dependencies...
[3/3] Linking workspace cross-dependencies...
success Installed and linked workspaces.
Done in 1.21s.
```

## Status

Right now only the `install` command is implemented. The plan is to implement
the entire Yarn Workspace API.
