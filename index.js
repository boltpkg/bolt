'use strict';

var ver = process.versions.node;
var majorVer = parseInt(ver.split('.')[0], 10);

if (majorVer < 4) {
  console.error(
    'Node version ' +
      ver +
      ' is not supported in Bolt, please use Node.js 4.0 or higher.'
  );
  process.exit(1);
} else if (majorVer < 8) {
  module.exports = require('./dist/legacy/index');
} else {
  module.exports = require('./dist/modern/index');
}
