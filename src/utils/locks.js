// @flow
import Package from '../Package';
import * as logger from './logger';
import * as npm from './npm';
import {settleAll} from './promises';
import {PError} from './errors';

const LOCK_DIST_TAG = 'pyarn-lock';

export async function lock(packages: Array<Package>) {
  let locks = [];
  let promises = [];

  logger.info('Attempting to get locks for all packages');

  for (let pkg of packages) {
    let {name, version} = pkg.config;
    let promise = npm.info(name).then(pkgInfo => {
      if (pkgInfo['dist-tags'].LOCK_DIST_TAG) {
        throw new PError(`Unable to get lock as a lock already exists for '${name}'`);
      }

      return npm.addTag(name, pkgInfo.version, LOCK_DIST_TAG).then(() => {
        locks.push(pkg);
      });
    })

    promises.push(promise);
  }

  try {
    await settleAll(promises);
  } catch (err) {
    logger.error(err.message);
    // Note: We only unlock the locks *we* just locked, as the other ones are currently being used
    await unlock(locks);
    throw new PError('Unable to lock all packages, someone else may be releasing');
  }
}

export async function unlock(packages: Array<Package>) {
  let promises = [];

  for (let pkg of packages) {
    promises.push(npm.removeTag(pkg.config.name, LOCK_DIST_TAG));
  }

  await Promise.all(promises);
}
