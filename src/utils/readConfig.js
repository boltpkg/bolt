// @flow
import readPkg from 'read-pkg';
import type {Config} from '../types';

export default async function readConfig(filePath: string): Promise<?Config> {
  return await readPkg(filePath);
}
