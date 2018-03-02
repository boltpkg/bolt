// @flow
const subCommands = {
  ...require('./cache'),
  ...require('./config'),
  ...require('./global'),
  ...require('./licenses'),
  ...require('./owner'),
  ...require('./project'),
  ...require('./tag'),
  ...require('./team'),
  ...require('./workspace'),
  ...require('./workspaces')
};

const commands = {
  add: require('./add').add,
  autoclean: require('./autoclean').autoclean,
  bin: require('./bin').bin,
  build: require('./build').build,
  check: require('./check').check,
  create: require('./create').create,
  doc: require('./doc').doc,
  exec: require('./exec').exec,
  format: require('./format').format,
  generate: require('./generate').generate,
  help: require('./help').help,
  import: require('./import').import_,
  info: require('./info').info,
  init: require('./init').init,
  install: require('./install').install,
  link: require('./link').link,
  lint: require('./lint').lint,
  list: require('./list').list,
  login: require('./login').login,
  logout: require('./logout').logout,
  normalize: require('./normalize').normalize,
  outdated: require('./outdated').outdated,
  pack: require('./pack').pack,
  publish: require('./publish').publish,
  publishLock: require('./publishLock').publishLock,
  publishUnlock: require('./publishUnlock').publishUnlock,
  remove: require('./remove').remove,
  run: require('./run').run,
  test: require('./test').test,
  unlink: require('./unlink').unlink,
  upgrade: require('./upgrade').upgrade,
  upgradeInteractive: require('./upgradeInteractive').upgradeInteractive,
  version: require('./version').version,
  versions: require('./versions').versions,
  why: require('./why').why
};
module.exports = {
  ...commands,
  ...subCommands
};
