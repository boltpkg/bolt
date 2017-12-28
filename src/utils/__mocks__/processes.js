const actualProcesses = require.requireActual('../processes');
const processes = jest.genMockFromModule('../processes');
const { ChildProcessError } = actualProcesses;

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

processes.spawn = jest.fn((cmd, args, opts) => {
  let found = mocks.find(mock => {
    if (cmd !== mock.cmd) return false;
    if (!isArrayShape(args, mock.args)) return false;
    if (!isObjectShape(opts, mock.opts)) return false;
    return true;
  });

  let res = {
    code: (found && found.code) || 0,
    stdout: (found && found.stdout) || '',
    stderr: (found && found.stderr) || ''
  };

  if (res.code === 0) {
    return Promise.resolve(res);
  } else {
    return Project.reject(
      new ChildProcessError(res.code, res.stdout, res.stderr)
    );
  }
});

processes.ChildProcessError = ChildProcessError;

// __mock('echo', ['test'], {}, { code: 0, stdout: '', stderr: '' });
processes.__mock = ({ cmd, args, opts }, { stdout, stderr, code }) => {
  mocks.push({ cmd, args, opts, stdout, stderr, code });
};

module.exports = processes;
