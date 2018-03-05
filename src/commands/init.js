// @flow
import { BoltError } from '../utils/errors';
import * as options from '../utils/options';
import * as yarn from '../utils/yarn';
import Package from '../Package';
import { isWorkspaceNeeded } from '../utils/prompts';
import addWorkspacesToJson from '../utils/jsonModifier';
import type { CommandArgsType } from '../types';

type InitOptions = {|
  cwd?: string,
  args: {
    private?: boolean,
    yes?: boolean
  }
|};

function toInitOptions(args: options.Args, flags: options.Flags): InitOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    args: options.toYarnInit(flags)
  };
}

export async function init({ commandArgs, flags }: CommandArgsType) {
  let opts = toInitOptions(commandArgs, flags);
  let cwd = opts.cwd || process.cwd();
  let spawnArgs = ['-s'];

  if (opts.args.private) spawnArgs.push('-p');
  if (opts.args.yes) spawnArgs.push('-y');

  try {
    await yarn.cliCommand(cwd, 'init', spawnArgs);

    if (spawnArgs.indexOf('-y') === -1) {
      const addWorkspace = await isWorkspaceNeeded();

      if (addWorkspace) {
        const pkg = await Package.closest(cwd);
        const config = pkg.config;
        let json = await addWorkspacesToJson(config.json);
        config.write(json);
      }
    }
  } catch (err) {
    throw new BoltError(`Unable to create new package due to: ${err}`);
  }
}
