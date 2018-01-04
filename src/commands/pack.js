// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import * as yarn from '../utils/yarn';

export type PackOptions = {
  cwd?: string,
  fileName?: string
};

export function toPackOptions(
  args: options.Args,
  flags: options.Flags
): PackOptions {
  let fileName =
    options.string(flags.filename, 'filename') || options.string(flags.f, 'f');
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    fileName: fileName || ''
  };
}

export async function pack(opts: PackOptions) {
  let cwd = opts.cwd || process.cwd();
  let fileName = opts.fileName ? [`--filename=${opts.fileName}`] : [];

  try {
    await yarn.cliCommand(cwd, 'pack', fileName);
  } catch (err) {
    throw new BoltError(err);
  }
}
