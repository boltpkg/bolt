// @flow
import pkgUp from 'pkg-up';
import detectIndent from 'detect-indent';
import parseJson from 'parse-json';
import * as path from 'path';
import * as fs from './fs';
import type {Config} from '../types';

async function findConfigFile(filePath: string): Promise<?string> {
  return await pkgUp(filePath);
}

export async function readConfigFile(filePath: string): Promise<Config> {
  let contents = await fs.readFile(filePath);
  let config = parseJson(contents);
  return config;
}

export async function writeConfigFile(filePath: string, config: Config) {
  let prevContents = (await fs.readFile(filePath)).toString();
  let indent = detectIndent(prevContents).indent || '  ';
  let contents = JSON.stringify(config, null, indent);
  await fs.writeFile(filePath, contents);
}

export async function getProjectConfig(cwd: string) {
  let searching = cwd;

  while (searching) {
    let filePath = await findConfigFile(searching);

    if (filePath) {
      let config = await readConfigFile(filePath);
      if (config && config.pworkspaces) {
        return filePath;
      }
      searching = path.dirname(path.dirname(filePath));
    } else {
      return null;
    }
  }
}
