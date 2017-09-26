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
  only: string | void,
  ignore: string | void
) {
  let onlyPattern = only || '**';
  let ignorePattern = ignore ? `!${ignore}` : '';
  return matchGlobs(paths, [onlyPattern, ignorePattern]);
}
