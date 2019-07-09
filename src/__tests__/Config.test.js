// @flow
import os from 'os';
import Config from '../Config';
import * as fs from '../utils/fs';
import { mkdtempSync } from 'fs';
import * as path from 'path';
import detectNewline from 'detect-newline';
import fixtures from 'fixturez';

const f = fixtures(__dirname);

jest.mock('../utils/logger');

describe('Config.init', () => {
  it('should read a valid package.json file', async () => {
    let filePath = path.join(f.find('simple-package'), 'package.json');
    let pkg = await Config.init(filePath);
    expect(pkg.json).toMatchObject({ name: 'fixture-basic' });
  });

  it('should error on an invalid package.json file', async () => {
    let filePath = path.join(
      f.find('package-with-invalid-json'),
      'package.json'
    );
    return expect(Config.init(filePath)).rejects.toBeDefined();
  });
});

describe('writeConfigFile', () => {
  let spy;

  beforeEach(() => {
    spy = jest.spyOn(fs, 'writeFile').mockImplementation(() => {});
  });

  afterEach(() => {
    spy.mockRestore();
  });

  it('should write a json file', async () => {
    let filePath = path.join(f.find('simple-package'), 'package.json');
    let json = { name: 'wat', version: '0.0.0' };
    let fileContents = JSON.stringify(json, null, 2) + os.EOL;
    let config = await Config.init(filePath);
    await config.write(json);
    expect(fs.writeFile).toHaveBeenCalledWith(filePath, fileContents);
  });

  it('should write a json file with correct-indentation', async () => {
    let filePath = path.join(
      f.find('package-with-four-spaces-json'),
      'package.json'
    );
    let json = { name: 'wat', version: '0.0.0' };
    let fileContents = JSON.stringify(json, null, 4) + os.EOL;
    let config = await Config.init(filePath);
    await config.write(json);
    expect(fs.writeFile).toHaveBeenCalledWith(filePath, fileContents);
  });

  it('should write a json file with correct-indentation when uncertain', async () => {
    let filePath = path.join(
      f.find('package-with-uncertain-indentation-json'),
      'package.json'
    );
    let json = { name: 'wat', version: '0.0.0' };
    let fileContents = JSON.stringify(json, null, 2) + os.EOL;
    let config = await Config.init(filePath);
    await config.write(json);
    expect(fs.writeFile).toHaveBeenCalledWith(filePath, fileContents);
  });

  it('should preserve the line endings style of the source json', async () => {
    let filePath = path.join(f.find('simple-package'), 'package.json');
    const packageFileContent = await fs.readFile(filePath);
    const readMock = jest.spyOn(fs, 'readFile').mockImplementation(async () => {
      return packageFileContent.toString().replace(/\n/g, '\r\n');
    });

    let json = { name: 'wat', version: '0.0.0' };
    let fileContents =
      JSON.stringify(json, null, 2).replace(/\n/g, '\r\n') + '\r\n';
    let config = await Config.init(filePath);
    await config.write(json);
    expect(fs.writeFile).toHaveBeenCalledWith(filePath, fileContents);
    readMock.mockRestore();
  });
});

describe('getProjectConfig()', () => {
  it('should get the root if it is the current directory', async () => {
    let fixturePath = f.find('simple-package');
    let found = await Config.getProjectConfig(fixturePath);
    expect(found).toBe(path.join(fixturePath, 'package.json'));
  });

  it('should get the root if in nested non-package directory', async () => {
    let fixturePath = path.join(f.find('simple-package'), 'packages');
    let found = await Config.getProjectConfig(fixturePath);
    expect(found).toBe(path.join(fixturePath, '..', 'package.json'));
  });

  it('should get the root if in nested package directory', async () => {
    let fixturePath = path.join(f.find('simple-package'), 'packages', 'bar');
    let found = await Config.getProjectConfig(fixturePath);
    expect(found).toBe(path.join(fixturePath, '..', '..', 'package.json'));
  });

  it('should return null if in non-package directory', async () => {
    let tempPath = mkdtempSync('/tmp/non-package-');
    let found = await Config.getProjectConfig(tempPath);
    expect(found).toBe(null);
  });

  it('should get the root if in nested package not included in a parent project', async () => {
    let fixturePath = path.join(
      f.find('simple-project-with-excluded-package'),
      'packages',
      'bar'
    );
    let found = await Config.getProjectConfig(fixturePath);
    expect(found).toBe(path.join(fixturePath, 'package.json'));
  });
});
