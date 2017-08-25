// @flow
import type {Args, Opts} from '../types';
import Project from '../Project';
import * as yarn from '../utils/yarn';

export default async function run(args: Args, opts: Opts) {
  let cwd = process.cwd();
  let project = await Project.init(cwd);
  let [script, ...scriptArgs] = args;

  await yarn.run(project.pkg, script, scriptArgs);
}
