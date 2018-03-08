// @flow
import * as options from './options';

const BOOLEAN_FLAGS = {
  D: true,
  dev: true,
  P: true,
  peer: true,
  O: true,
  optional: true,
  E: true,
  exact: true,
  T: true,
  tilde: true,
  F: true,
  force: true,
  I: true,
  init: true,
  y: true,
  yes: true,
  pureLockfile: true,
  ignoreEngines: true
};

const BOLT_FLAGS = {
  onlyFs: true,
  ignoreFs: true
};

function camelCaseToKebabCase(scriptFlag: string) {
  return scriptFlag.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export function getArgsBooleanFlagsScriptFlags(flags: options.Flags = {}) {
  let additionalArgs = [];
  let scriptFlags = [];
  let updatedFlags = Object.assign({}, flags);
  scriptFlags = Object.keys(updatedFlags).map(flag => {
    if (flag === '--') return '';

    if (BOOLEAN_FLAGS[flag] && typeof updatedFlags[flag] === 'string') {
      additionalArgs.push(updatedFlags[flag]);
      updatedFlags[flag] = true;
    }

    if (!BOLT_FLAGS[flag]) {
      return updatedFlags[flag] === true
        ? `--${camelCaseToKebabCase(flag)}`
        : `--${camelCaseToKebabCase(flag)} ${updatedFlags[flag]}`;
    }

    return '';
  });

  return {
    additionalArgs,
    scriptFlags,
    updatedFlags
  };
}
