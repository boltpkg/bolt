// @flow
import * as options from '../utils/options';
import * as logger from '../utils/logger';
import * as messages from '../utils/messages';
import {
  publish as publishUtil,
  type PublishOptions,
  type PackageMeta
} from '../utils/publish';
import { BoltError } from '../utils/errors';

export function toPublishOptions(
  args: options.Args,
  flags: options.Flags
): PublishOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    access: options.string(flags.access, 'access')
  };
}

function partition(collection, predicate = x => x): PackageMeta[][] {
  return collection.reduce(
    ([a, b], value) => {
      (predicate(value) ? a : b).push(value);
      return [a, b];
    },
    [[], []]
  );
}

export async function publish(opts: PublishOptions) {
  const response: PackageMeta[] = await publishUtil(opts);

  const [successful, unsuccessful] = partition(response, p => p.published);

  for (const pkg of successful) {
    logger.success(
      messages.successfullyPublishedPackage(pkg.name, pkg.newVersion)
    );
  }

  for (const pkg of unsuccessful) {
    logger.error(messages.failedToPublishPackage(pkg.name));
  }

  if (unsuccessful.length > 0) {
    throw new BoltError(
      `Failed to publish ${unsuccessful.length} ${
        unsuccessful.length === 1 ? 'package' : 'packages'
      }`
    );
  }
}
