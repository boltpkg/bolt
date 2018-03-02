// @flow
import addDependenciesToPackage from '../../utils/addDependenciesToPackages';
import Project from '../../Project';
import * as options from '../../utils/options';
import * as logger from '../../utils/logger';
import type { Dependency, configDependencyType } from '../../types';
import { DEPENDENCY_TYPE_FLAGS_MAP } from '../../constants';
import { add } from '../add';

type ProjectAddOptions = {};

function toProjectAddOptions(
  args: options.Args,
  flags: options.Flags
): ProjectAddOptions {
  return {};
}

export async function add(flags: options.Flags, args: options.Args) {
  await add(flags, args);
}
