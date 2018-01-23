// @flow
import { BoltError } from './errors';
import * as logger from './logger';
import * as messages from './messages';
import * as processes from './processes';
import pLimit from 'p-limit';

const npmRequestLimit = pLimit(40);

export function info(pkgName: string) {
  return npmRequestLimit(async () => {
    logger.info(messages.npmInfo(pkgName));

    const result = await processes.spawn('npm', ['info', pkgName, '--json'], {
      silent: true
    });

    return JSON.parse(result.stdout);
  });
}

export async function infoAllow404(pkgName: string) {
  try {
    const pkgInfo = await info(pkgName);
    return { published: true, pkgInfo };
  } catch (error) {
    const output = JSON.parse(error.stdout);
    if (output.error && output.error.code === 'E404') {
      logger.warn(messages.npmInfo404(pkgName));
      return { published: false, pkgInfo: {} };
    }
    throw error;
  }
}

export function publish(
  pkgName: string,
  opts: { cwd?: string, access?: string } = {}
) {
  return npmRequestLimit(async () => {
    logger.info(messages.npmPublish(pkgName));
    const publishFlags = opts.access ? ['--access', opts.access] : [];

    try {
      await processes.spawn('npm', ['publish', ...publishFlags], {
        cwd: opts.cwd
      });
      return { published: true };
    } catch (error) {
      // Publish failed
      return { published: false };
    }
  });
}

export function addTag(pkgName: string, pkgVersion: string, tag: string) {
  return npmRequestLimit(async () => {
    logger.info(messages.npmDistTagAdd(pkgName, pkgVersion, tag));
    let pkgStr = `${pkgName}@${pkgVersion}`;
    let result = await processes.spawn('npm', ['dist-tag', 'add', pkgStr, tag]);
    // An existing tag will return a warning to stderr, but a 0 status code
    if (result.stderr) {
      throw new BoltError(
        `Could not add tag ${tag} to ${pkgStr} as one already exists`
      );
    }
    return result;
  });
}

export function removeTag(pkgName: string, tag: string) {
  return npmRequestLimit(async () => {
    logger.info(messages.npmDistTagRm(pkgName, tag));

    try {
      return await processes.spawn('npm', ['dist-tag', 'rm', pkgName, tag], {
        silent: true
      });
    } catch (error) {
      // The dist tag not existing is unexpected, but shouldn't prevent execution
      if (error.code === 1 && error.stderr.includes('is not a dist-tag on')) {
        logger.warn(messages.notDistTagFound(tag, pkgName));
        return;
      } else if (
        error.stderr &&
        error.stderr.startsWith('npm ERR! code E404')
      ) {
        // the package does not exist yet, warn but dont error
        logger.warn(messages.npmPackageCouldNotBeFound(pkgName));
        return;
      }
      throw error;
    }
  });
}

export async function login(cwd: string) {
  await processes.spawn('npm', ['login'], {
    cwd,
    tty: true
  });
}

export async function logout(cwd: string) {
  await processes.spawn('npm', ['logout'], {
    cwd,
    tty: true
  });
}
