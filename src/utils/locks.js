// @flow
import Package from '../Package';
import * as logger from './logger';
import * as messages from './messages';
import * as npm from './npm';
import { settleAll } from './promises';
import { BoltError } from './errors';

const LOCK_DIST_TAG = 'bolt-lock';

export async function lock(packages: Array<Package>) {
  let locks = [];
  let promises = [];

  logger.info(messages.lockingAllPackages());

  for (let pkg of packages) {
    let name = pkg.config.getName();
    let version = pkg.config.getVersion();
    let promise = npm.infoAllow404(name).then(response => {
      if (response.published) {
        let pkgInfo = response.pkgInfo || {};
        if (pkgInfo['dist-tags'][LOCK_DIST_TAG]) {
          throw new BoltError(
            `Unable to get lock as a lock already exists for '${name}'`
          );
        }
        return npm.addTag(name, pkgInfo.version, LOCK_DIST_TAG).then(() => {
          locks.push(pkg);
        });
      }
    });
    promises.push(promise);
  }

  try {
    await settleAll(promises);
  } catch (err) {
    logger.error(err.message);
    // Note: We only unlock the locks *we* just locked, as the other ones are currently being used
    await _unlock(locks);
    throw new BoltError(
      'Unable to lock all packages, someone else may be releasing'
    );
  }
}

async function _unlock(packages: Array<Package>) {
  let promises = [];

  for (let pkg of packages) {
    promises.push(npm.removeTag(pkg.config.getName(), LOCK_DIST_TAG));
  }

  await Promise.all(promises);
}

export async function unlock(packages: Array<Package>) {
  let promises = [];

  for (let pkg of packages) {
    let name = pkg.config.getName();
    let promise = npm.infoAllow404(name).then(response => {
      if (response.published) {
        let pkgInfo = response.pkgInfo || {};
        if (!pkgInfo['dist-tags'][LOCK_DIST_TAG]) {
          return;
        }
        return npm.removeTag(pkg.config.getName(), LOCK_DIST_TAG);
      }
    });

    promises.push(promise);
  }

  await Promise.all(promises);
}
