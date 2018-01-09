## Developing

**Note:** Recommended to use Node > 8.5, and Node < 4 is not supported

> Please make sure your have [yarn](https://yarnpkg.com/en/docs/install) installed

Folder Structure:

```yml
- bin.js                         # node executable, this where bolt starts
  - src
    - cli.js                     # taking in user args, and converting them to command map, - also calls the command as per argv
    - Package.js
    - Project.js
    - types.js
    - Workspace.js
    - commands                   # all the commands are here
      - workspace                # workspace related commands
      - workspaces               # workspaces related commands
      : : : : : : :
    - utils
      - messages.js              # log messages
      - yarn.js                  # yarn related commands
      : : : : : : :
```

SetUp:

- Fork the repo
- Clone repo - `git clone git@github.com:<your-git-username->/bolt.git`
- cd into the repo, `cd bolt`
- install dependencies - `yarn install`

Develop:

Running the build in watch mode:

```sh
yarn build:modern --watch
```

Testing:

Running test in watch mode:

```sh
yarn run test --watch
```
