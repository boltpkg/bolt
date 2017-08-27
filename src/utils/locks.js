// @flow
import Package from '../Package';
import * as npm from './npm';

const LOCK_DIST_TAG = 'pyarn-lock';

export async function lock(packages: Array<Package>) {
  let locks = [];
  let promises = [];

  for (let pkg of packages) {
    let {name, version} = pkg.config;
    let promise = npm.addTag(name, version, LOCK_DIST_TAG).then(() => {
      locks.push(pkg);
    });
    promises.push(promise);
  }

  try {
    await Promise.all(promises);
  } catch (err) {
    await unlock(locks);
    throw new Error('Found a lock tag', err);
  }
}

export async function unlock(packages: Array<Package>) {
  let promises = [];

  for (let pkg of packages) {
    promises.push(npm.removeTag(pkg.config.name, LOCK_DIST_TAG));
  }

  await Promise.all(promises);
}
