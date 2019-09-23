// @flow
import { BoltError } from './errors';
import * as logger from './logger';
import * as messages from './messages';
import * as processes from './processes';
import pLimit from 'p-limit';

const npmRequestLimit = pLimit(40);

function getCorrectRegistry() {
  let registry =
    process.env.npm_config_registry === 'https://registry.yarnpkg.com'
      ? undefined
      : process.env.npm_config_registry;
  return registry;
}

export function info(pkgName: string) {
  return npmRequestLimit(async () => {
    logger.info(messages.npmInfo(pkgName));

    // Due to a couple of issues with yarnpkg, we also want to override the npm registry when doing
    // npm info.
    // Issues: We sometimes get back cached responses, i.e old data about packages which causes
    // `publish` to behave incorrectly. It can also cause issues when publishing private packages
    // as they will always give a 404, which will tell `publish` to always try to publish.
    // See: https://github.com/yarnpkg/yarn/issues/2935#issuecomment-355292633
    const envOverride = {
      npm_config_registry: getCorrectRegistry()
    };

    let result = await processes.spawn('npm', ['info', pkgName, '--json'], {
      silent: true,
      env: Object.assign({}, process.env, envOverride)
    });

    return JSON.parse(result.stdout);
  });
}

export async function infoAllow404(pkgName: string) {
  try {
    let pkgInfo = await info(pkgName);
    return { published: true, pkgInfo };
  } catch (error) {
    let output = JSON.parse(error.stdout);
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
    let publishFlags = opts.access ? ['--access', opts.access] : [];
    try {
      // Due to a super annoying issue in yarn, we have to manually override this env variable
      // See: https://github.com/yarnpkg/yarn/issues/2935#issuecomment-355292633
      const envOverride = {
        npm_config_registry: getCorrectRegistry()
      };
      await processes.spawn('npm', ['publish', ...publishFlags], {
        cwd: opts.cwd,
        env: Object.assign({}, process.env, envOverride)
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

export async function cliCommand(
  cwd: string,
  command: string = '',
  spawnArgs: Array<string> = []
) {
  return await processes.spawn('npm', [command, ...spawnArgs], {
    cwd,
    tty: true
  });
}
