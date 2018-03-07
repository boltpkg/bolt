// @flow
import { BoltError } from '../utils/errors';
import * as options from '../utils/options';
import * as yarn from '../utils/yarn';
import Package from '../Package';
import { isWorkspaceNeeded } from '../utils/prompts';
import addWorkspacesToJson from '../utils/jsonModifier';

export type InitOptions = {|
  cwd?: string,
  args: {
    private?: boolean,
    yes?: boolean
  }
|};

export function toInitOptions(
  args: options.Args,
  flags: options.Flags
): InitOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    args: options.toYarnInit(flags)
  };
}

export async function init(opts: InitOptions) {
  let cwd = opts.cwd || process.cwd();
  let spawnArgs = ['-s'];

  if (opts.args.private) spawnArgs.push('-p');
  if (opts.args.yes) spawnArgs.push('-y');

  try {
    await yarn.cliCommand(cwd, 'init', spawnArgs);

    if (spawnArgs.indexOf('-y') === -1) {
      let addWorkspace = await isWorkspaceNeeded();

      if (addWorkspace) {
        let pkg = await Package.closest(cwd);
        let config = pkg.config;
        let json = await addWorkspacesToJson(config.json);
        config.write(json);
      }
    }
  } catch (err) {
    throw new BoltError(`Unable to create new package due to: ${err}`);
  }
}
