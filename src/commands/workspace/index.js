// @flow
module.exports = {
  ...require('./add'),
  ...require('./exec'),
  ...require('./link'),
  ...require('./remove'),
  ...require('./run'),
  ...require('./unlink'),
  ...require('./upgrade')
};
