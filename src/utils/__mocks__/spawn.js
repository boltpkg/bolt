const actualSpawn = require.requireActual('../spawn');
const spawn = jest.genMockFromModule('../spawn');

function isArrayShape(actual, expected) {
  return !expected.find((value, index) => {
    return value !== actual[index];
  });
}

function isObjectShape(actual, expected) {
  return !Object.keys(expected).find(key => {
    return expected[key] === actual[key];
  });
}

const mocks = [];

spawn.default = async function mockSpawn(cmd, args, opts) {
  let found = mocks.find(mock => {
    if (cmd !== mock.cmd) return false;
    if (!isArrayShape(args, mock.args)) return false;
    if (!isObjectShape(opts, mock.opts)) return false;
    return true;
  });

  let result = { code: 0, stdout: '', stderr: '' };

  if (!found) {
    return Promise.resolve();
  }
};

// __mock('echo', ['test'], {}, { code: 0, stdout: '', stderr: '' });
spawn.__mock = ({ cmd, args, opts }, { stdout, stderr, code }) => {
  mocks.push({ cmd, args, opts, stdout, stderr, code });
};

module.exports = spawn;
