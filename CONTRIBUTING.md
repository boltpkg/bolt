# Contributing to Bolt

Join the boltpkg community slack room at https://boltpkg.slack.com

**Note:** Recommended to use Node > 8.5, (*Node < 4 is not supported*)

> Please make sure you have latest [yarn](https://yarnpkg.com/en/docs/install) installed

## Folder Structure:

```yml
- bin.js                         # node executable, this where bolt starts
  - src
    - cli.js                     # taking in user args, and converting them to command map, - also calls the command as per argv
    - Package.js                 # exports function to initialise a package
    - Project.js                 # exports function to initialise a project
    - types.js                   # flow types
    - commands                   # all the commands are here
      - workspace                # workspace related commands
      - workspaces               # workspaces related commands
      : : : : : : :
      - add.js                   # bolt add command
      - bin.js                   # bolt bin command
      : : : : : : :
    - utils
      - messages.js              # log messages
      - yarn.js                  # yarn related commands
      : : : : : : :
```

## SetUp:

- Clone the repo - `git clone https://github.com/boltpkg/bolt.git`
- cd into the repo, `cd bolt`
- install dependencies - `yarn install`

## Develop:

Running the build in watch mode:

```sh
yarn build:modern --watch
```

## Testing:

Running test in watch mode:

```sh
yarn run test --watch
```

> Please note that this project is released with a [Contributor Code of Conduct](code-of-conduct.md). By participating in this project you agree to its terms.
