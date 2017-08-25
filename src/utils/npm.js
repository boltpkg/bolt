// @flow
import * as processes from './processes';
import * as logger from './logger';
import pLimit from 'p-limit';

const npmRequestLimit = pLimit(40);

export function info(pkgName: string) {
  return npmRequestLimit(async () => {
    logger.info(`npm info ${pkgName}`);

    let result = await processes.spawn('npm', ['info', pkgName, '--json'], {
      silent: true,
    });

    return JSON.parse(result.stdout);
  });
}

export function addTag(pkgName: string, pkgVersion: string, tag: string) {
  return npmRequestLimit(async () => {
    // ...
  });
}

export async function removeTag(pkgName: string, tag: string) {
  return npmRequestLimit(async () => {
    // ...
  });
}
