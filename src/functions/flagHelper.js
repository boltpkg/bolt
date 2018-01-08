// @flow

const IS_BOOLEAN_FLAGS = {
  '--dev': true,
  '--peerdev': true
};

function isFlagWithValue(flag) {
  return flag.indexOf('=') > -1;
}

function isFlag(maybeFlag) {
  return maybeFlag.indexOf('--') > -1;
}

export function identifyFlags(args: Array<string> = []) {
  let flags = [];
  args.forEach((arg, index) => {
    if (isFlag(arg)) {
      if (IS_BOOLEAN_FLAGS[arg]) {
        flags.push(arg);
      } else {
        if (isFlagWithValue(arg)) {
          flags.push(arg);
        } else {
          flags.push(arg, args[++index]);
        }
      }
    }
  });
  return flags;
}

export function extractPossibleArgs(flags = {}) {
  let additionalArgs = [];
  let updatedFlags = Object.assign({}, flags);
  Object.keys(updatedFlags).forEach(flag => {
    if (IS_BOOLEAN_FLAGS['--' + flag]) {
      additionalArgs.push(updatedFlags[flag]);
      updatedFlags[flag] = true;
    }
  });
  return {
    additionalArgs,
    updatedFlags
  };
}
