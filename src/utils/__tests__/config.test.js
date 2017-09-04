// @flow
import * as config from '../config';
import * as fs from '../fs';
import {mkdtempSync} from 'fs';
import * as path from 'path';
import {getFixturePath} from 'jest-fixtures';

const FIXTURES_DIR = path.resolve(__dirname, '..', '..', '..', '__fixtures__');

describe('readConfigFile', () => {
  it('should read a valid package.json file', async () => {
    let filePath = await getFixturePath(__dirname, 'simple-package', 'package.json');
    let pkg = await config.readConfigFile(filePath);
    expect(pkg).toMatchObject({
      name: 'fixture-basic',
    });
  });

  it('should error on an invalid package.json file', async () => {
    let filePath = await getFixturePath(__dirname, 'package-with-invalid-json', 'package.json');
    return expect(config.readConfigFile(filePath)).rejects.toBeDefined();
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
    let filePath = await getFixturePath(__dirname, 'simple-package', 'package.json');
    let pkg = { name: 'wat', version: '0.0.0' };
    await config.writeConfigFile(filePath, pkg);
    expect(fs.writeFile).toHaveBeenCalledWith(filePath, JSON.stringify(pkg, null, 2));
  });

  it('should write a json file with correct-indentation', async () => {
    let filePath = await getFixturePath(__dirname, 'package-with-four-spaces-json', 'package.json');
    let pkg = { name: 'wat', version: '0.0.0' };
    await config.writeConfigFile(filePath, pkg);
    expect(fs.writeFile).toHaveBeenCalledWith(filePath, JSON.stringify(pkg, null, 4));
  });

  it('should write a json file with correct-indentation when uncertain', async () => {
    let filePath = await getFixturePath(__dirname, 'package-with-uncertain-indentation-json', 'package.json');
    let pkg = { name: 'wat', version: '0.0.0' };
    await config.writeConfigFile(filePath, pkg);
    expect(fs.writeFile).toHaveBeenCalledWith(filePath, JSON.stringify(pkg, null, 2));
  });
});

describe('getProjectConfig()', () => {
  it('should get the root if it is the current directory', async () => {
    let fixturePath = await getFixturePath(__dirname, 'simple-project');
    let found = await config.getProjectConfig(fixturePath);
    expect(found).toBe(path.join(fixturePath, 'package.json'));
  });

  it('should get the root if in nested non-package directory', async () => {
    let fixturePath = await getFixturePath(__dirname, 'simple-project', 'packages');
    let found = await config.getProjectConfig(fixturePath);
    expect(found).toBe(path.join(fixturePath, '..', 'package.json'));
  });

  it('should get the root if in nested package directory', async () => {
    let fixturePath = await getFixturePath(__dirname, 'simple-project', 'packages', 'bar');
    let found = await config.getProjectConfig(fixturePath);
    expect(found).toBe(path.join(fixturePath, '..', '..', 'package.json'));
  });

  it('should return null if in non-package directory', async () => {
    let tempPath = mkdtempSync('/tmp/non-package-');
    let found = await config.getProjectConfig(tempPath);
    expect(found).toBe(null);
  });

  it('should get the root if in nested package not included in a parent project', async () => {
    let fixturePath = await getFixturePath(__dirname, 'simple-project-with-excluded-package', 'packages', 'bar');
    let found = await config.getProjectConfig(fixturePath);
    expect(found).toBe(path.join(fixturePath, 'package.json'));
  });
});
