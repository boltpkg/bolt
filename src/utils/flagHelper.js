// @flow
import * as options from './options';

const BOOLEAN_FLAGS = {
  dev: true,
  peer: true
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
    if (BOOLEAN_FLAGS[flag]) {
      additionalArgs.push(updatedFlags[flag]);
      updatedFlags[flag] = true;
    }

    if (!BOLT_FLAGS[flag]) {
      return `--${camelCaseToKebabCase(flag)} ${updatedFlags[flag]}`;
    }

    return '';
  });

  return {
    additionalArgs,
    scriptFlags,
    updatedFlags
  };
}
