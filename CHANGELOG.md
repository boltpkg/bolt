# Bolt Changelog

# 0.24.7

* Fix workspace versions not resolving when installed via dist tag (#283 thanks @Blasz)

# 0.24.6

* Bumps dependencies on `meow` and `inquirer` (#278 thanks @patrickcylai)
* Fix issue where `bolt` twice would break during bin symlink step (#273 thanks @jcreamer898)

# 0.24.5

* Add --no-prefix flag to disable prefixing subcommand output with the command string

# 0.24.4

* Fix --no-bail not throwing when running in default orderMode (#256)

# 0.24.3

* Fixes `--help` so that is is correctly passed down to other commands (#252)
* `bolt add` on an existing dependency now correctly updates all workspaces versions if required (#251)
* Allow exclusion of certain dependency types from dependency graph (#244)

# 0.24.2

* Upgrade prettier to latest (#250)
* Fix --no-bail flag (#247)
* Add bolt_config_user_agent env var to `yarn add` (#240)
* Update toDependency util to handle versions containing @ symbols (#248)
* Fix bolt add not reinstalling packages from the project root (#249)

## 0.24.1

* fix for #207 windows cmdshim problem (#241)

## 0.24.0

* Add filterOpts option to runWorkspaceTasks function (#245)
* Drop node v4 support and require v6 at minimum BREAKING (#246)
* fix #56 for workspaces --dev flag swallows first dependency (#242)

## 0.23.6

* feat: allow passing --frozen-lockfile to yarn (#238)

## 0.23.5

* Updated to skip workspaces that are missing a package.json (#235)

## 0.23.4

* Fix fix for yarn setting an npm_config_registry (#234)
* Remove quotes around `yarn upgrade` args (#229)

## 0.23.2

* Get rid of yarn run -- warning (#225)

## 0.23.1

* Add new line to the end of file, preserve line endings style (#224)

## 0.23.0

* Fixes #90 by passing flags down as args for run commands (#214)
* #195 Added bail option, clean processes if bailing early (#200)

## 0.22.6

* Fix project run throwing invalid error (#210)

## 0.22.5

* feat: add prePublish hook for publishing packages (#208)

## 0.22.4

* Add --parallel-nodes flag (#197)

## 0.22.3

* Pass bolt_config_user_agent to env when running install (#148) (#198)

## 0.22.2

* Adds symlinking of package binaries to the project at install (#194)

## 0.22.1

* Overrides the npm_config_registry var when doing info calls

## 0.22.0

* add --serial and --parallel options (#192)

## 0.21.2

* Fix issue with cross-dep bins not symlinking (#191)

## 0.21.1

* Fixes incorrect import in publishCommand

## 0.21.0

* Separate publish CLI from exposed publishPackages function (#188)
* Adds checks for config name and version fields to project validation (#168)
* chore: bump yarn to v1.9.4 (#184)
* Fixes bug when running publish using bolt or yarn (#190)
* Updates an error message to be much more prominent (#182)

## 0.20.7

* Fixes logging and makes much clearer what is happening during publish (#174)

## 0.20.6

* fix await install (#169)

## 0.20.5

* Fixes publish command to not include private packages (#166)

## 0.20.4

* Fixes bolt install to use local yarn instead of global (#165)

## 0.20.3

* Bump Yarn

## 0.20.2

* Fixes bug where packages with a dep and a devDep on a package would not be able to upgrade that dep (#159)

## 0.20.1

* Fix executable linking issues on win32 (#154)

## 0.20.0

* Add filtering to getWorkspaces function (#161)
* Adding global upgrade
* Adding global remove
* Adding global list
* Adding global bin

## 0.19.3

* Prefix npm_config_user_agent env var set by yarn with bolt version (#149)
* adding global add
* adding the owner command (#150)
* Adds team destroy
* Adds team remove
* Adds team list
* Adds team create
* Adds team add
* Adds tag remove
* Adds tag list
* Adds tag add
* adding config-current (#140)
* Adding config set option (#139)
* Adds Config delete (#138)
* implenent bolt import (#136)
* adds config get (#135)
* Adding bolt config list command (#134)
* Adding workspace in init (#131)
* implemented login and logout (#125)
* Adding Project Upgrade option (#129)
* bolt autoclean (#122)
* Adding Project add <dependency> (#121)

## 0.19.2

* Fixes calculation of yarn relative path from package.dir instead of project.dir (#124)

## 0.19.1

* Makes yarn run output display relative path to yarn instead of absolute (#123)

