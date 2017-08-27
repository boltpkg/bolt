// @flow
import type {Args, Opts} from '../types';
import * as yarn from '../utils/yarn';

export default async function init(args: Args, opts: Opts) {
  let cwd = process.cwd();

  await yarn.init(cwd);
}
