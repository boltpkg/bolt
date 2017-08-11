// @flow
import * as processes from './processes';
import * as logger from './logger';
import pLimit from 'p-limit';

const npmRequestLimit = pLimit(20);

export function info(pkgName: string) {
  return npmRequestLimit(async () => {
    logger.info(`npm info ${pkgName}`);

    let result = await processes.spawn('npm', ['info', pkgName, '--json'], {
      silent: true,
    });

    return JSON.parse(result.stdout);
  });
}
