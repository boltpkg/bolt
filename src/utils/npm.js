// @flow
import {PError} from './errors';
import * as logger from './logger';
import * as processes from './processes';
import pLimit from 'p-limit';

const npmRequestLimit = pLimit(40);

export function info(pkgName: string) {
  return npmRequestLimit(async () => {
    logger.info(`npm info ${pkgName}`);

    const result = await processes.spawn('npm', ['info', pkgName, '--json'], {
      silent: true,
    });

    return JSON.parse(result.stdout);
  });
}

export function addTag(pkgName: string, pkgVersion: string, tag: string) {
  return npmRequestLimit(async () => {
    const pkgStr = `${pkgName}@${pkgVersion}`;
    logger.info(`npm dist-tag ${pkgStr} ${tag}`);

    const result = await processes.spawn('npm', ['dist-tag', 'add', pkgStr, tag]);
    // An existing tag will return a warning to stderr, but a 0 status code
    if (result.stderr) {
      throw new PError(`Could not lock ${pkgStr} as a lock already exists`);
    }
    return result;
  });}


export async function removeTag(pkgName: string, tag: string) {
  return npmRequestLimit(async () => {
    logger.info(`npm dist-tag rm ${pkgName} ${tag}`);

    try {
      return await processes.spawn('npm', ['dist-tag', 'rm', pkgName, tag]);
    } catch (error) {
      // The dist tag not existing is unexpected, but shouldn't prevent execution
      if (error.code === 1 && error.stderr.includes('is not a dist-tag on')) {
        logger.info(`No dist tag "${tag}" found for package ${pkgName}`);
        return;
      }
      throw error;
    }
  });
}
