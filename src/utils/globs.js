// @flow
import multimatch from 'multimatch';
import globby from 'globby';
import * as path from 'path';

function matchGlobs(paths: Array<string>, patterns: Array<string>) {
  return multimatch(paths, patterns);
}

function findGlobs(cwd: string, patterns: Array<string>) {
  return globby(patterns, { cwd });
}

export function matchWorkspaces(paths: Array<string>, patterns: Array<string>) {
  return matchGlobs(paths, patterns);
}

export function findWorkspaces(cwd: string, patterns: Array<string>) {
  return findGlobs(cwd, patterns);
}

export function matchOnlyAndIgnore(
  paths: Array<string>,
  only: string | Array<string> | void,
  ignore: string | Array<string> | void
) {
  if (only && !Array.isArray(only)) {
    only = [only];
  }
  if (ignore && !Array.isArray(ignore)) {
    ignore = [ignore];
  }

  let onlyPatterns = only && only.length > 0 ? only : ['**'];
  let ignorePatterns = ignore ? ignore.map(pattern => `!${pattern}`) : [];
  return matchGlobs(paths, [...onlyPatterns, ...ignorePatterns]);
}
