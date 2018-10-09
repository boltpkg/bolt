// @flow
import type Project from '../Project';
import type Package from '../Package';
import * as processes from './processes';
import * as options from './options';

export default function execCommand(
  project: Project,
  pkg: Package,
  command: string,
  commandArgs: options.Args
) {
  let PATH_PARTS = [];

  // We don't want to add the project package to the PATH twice
  if (!pkg.isSamePackage(project.pkg)) {
    PATH_PARTS.push(pkg.nodeModulesBin);
  }

  PATH_PARTS.push(project.pkg.nodeModulesBin);

  if (process.env.PATH) {
    PATH_PARTS.push(process.env.PATH);
  }

  let PATH = PATH_PARTS.join(':');

  return processes.spawn(command, commandArgs, {
    pkg,
    cwd: pkg.dir,
    tty: false,
    env: { ...process.env, PATH }
  });
}
