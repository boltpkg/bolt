// @flow
import Package from '../Package';
import Config from '../Config';
import * as fs from '../utils/fs';
import { mkdtempSync } from 'fs';
import * as path from 'path';
import fixtures from 'fixturez';

const f = fixtures(__dirname);

jest.mock('../utils/logger');

describe('Package', () => {
  describe('init()', () => {
    it('should return a valid Package', async () => {
      let filePath = path.join(f.find('simple-package'), 'package.json');
      let pkg = await Package.init(filePath);

      expect(pkg).toBeInstanceOf(Package);
      expect(pkg.filePath).toBe(filePath);
      expect(pkg.config).toBeInstanceOf(Config);
    });

    it('should error on an invalid package.json file', async () => {
      let filePath = path.join(
        f.find('package-with-invalid-json'),
        'package.json'
      );
      return expect(Package.init(filePath)).rejects.toBeDefined();
    });
  });

  describe('getDependencyTypes', () => {
    it('should return dependency type of a dependency', async () => {
      let filePath = path.join(f.find('nested-workspaces'), 'package.json');
      let pkg = await Package.init(filePath);
      let depTypes = pkg.getDependencyTypes('react');
      expect(depTypes).toEqual(['dependencies']);
    });

    it('should return multiple dependency types if they exist', async () => {
      let filePath = path.join(
        f.find('simple-project-with-multiple-depTypes'),
        'package.json'
      );
      let pkg = await Package.init(filePath);
      let depTypes = pkg.getDependencyTypes('react');
      expect(depTypes).toEqual(['devDependencies', 'peerDependencies']);
    });

    it('should return an empty array if dep does not exist', async () => {
      let filePath = path.join(f.find('simple-package'), 'package.json');
      let pkg = await Package.init(filePath);
      let depTypes = pkg.getDependencyTypes('non-existent-dep');
      expect(depTypes).toEqual([]);
    });
  });

  describe('getAllDependencies', () => {
    it('should return all dependencies of the package', async () => {
      let filePath = path.join(
        f.find('simple-project-with-multiple-depTypes'),
        'package.json'
      );
      let pkg = await Package.init(filePath);
      let dependencies = pkg.getAllDependencies();
      let expected = new Map([
        ['depOnly', '^1.0.0'],
        ['devDepOnly', '^1.0.0'],
        ['react', '^16.0.0'],
        ['peerDepOnly', '^1.0.0']
      ]);
      expect(dependencies).toEqual(expected);
    });

    it('should filter out dependencies of a certain type when passed the excludedTypes arg', async () => {
      let filePath = path.join(
        f.find('simple-project-with-multiple-depTypes'),
        'package.json'
      );
      let pkg = await Package.init(filePath);
      let dependencies = pkg.getAllDependencies(['devDependencies']);
      let expected = new Map([
        ['depOnly', '^1.0.0'],
        ['peerDepOnly', '^1.0.0'],
        ['react', '^16.0.0']
      ]);
      expect(dependencies).toEqual(expected);
    });
  });
});
