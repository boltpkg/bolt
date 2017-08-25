// @flow
import pkgUp from 'pkg-up';
import detectIndent from 'detect-indent';
import parseJson from 'parse-json';
import multimatch from 'multimatch';
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

export async function getPackageStack(cwd: string) {
  let stack = [];
  let searching = cwd;

  while (searching) {
    let filePath = await findConfigFile(searching);

    if (filePath) {
      let config = await readConfigFile(filePath);
      stack.unshift({ filePath, config });
      searching = path.dirname(path.dirname(filePath));
    } else {
      searching = null;
    }
  }

  return stack;
}

export async function getProjectConfig(cwd: string) {
  let stack = await getPackageStack(cwd);

  let highest = stack.pop();
  let matches = [highest];

  while (stack.length) {
    let current = stack.pop();

    if (current.config.pworkspaces) {
      let patterns = current.config.pworkspaces;
      let filePaths = matches.map(match => {
        return path.relative(path.dirname(current.filePath), path.dirname(match.filePath));
      });

      let found = multimatch(filePaths, patterns);

      if (found.length) {
        matches.push(current);
        highest = current;
      }
    }
  }

  return highest.filePath;
}
