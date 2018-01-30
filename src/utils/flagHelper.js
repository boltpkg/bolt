// @flow
import * as options from './options';

const BOOLEAN_FLAGS = {
  '--dev': true,
  '--peer': true
};

function isFlagWithValue(flag) {
  return flag.indexOf('=') > -1;
}

function isFlag(maybeFlag) {
  return maybeFlag.indexOf('--') > -1;
}

export function identifyFlags(args: Array<string> = []) {
  let flagsWithArgs = [];
  args.forEach((arg, index) => {
    if (isFlag(arg)) {
      if (BOOLEAN_FLAGS[arg]) {
        flagsWithArgs.push(arg);
      } else {
        index < args.length - 1
          ? flagsWithArgs.push(`${arg}=${arg[++index]}`)
          : flagsWithArgs.push(args);
      }
    }
  });
  return flagsWithArgs;
}

export function extractPossibleArgs(flags: options.Flags = {}) {
  let additionalArgs = [];
  let updatedFlags = Object.assign({}, flags);
  Object.keys(updatedFlags).forEach(flag => {
    if (BOOLEAN_FLAGS['--' + flag]) {
      additionalArgs.push(updatedFlags[flag]);
      updatedFlags[flag] = true;
    }
  });
  return {
    additionalArgs,
    updatedFlags
  };
}
