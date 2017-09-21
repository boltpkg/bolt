// @flow
import * as fs from '../fs';
import * as path from 'path';
import { realpathSync } from 'fs';
import { getFixturePath, createTempDir } from 'jest-fixtures';
import modeToPermissions from 'mode-to-permissions';

const REAL_PLATFORM = process.platform;

describe('fs', () => {
  describe('readFile()', () => {
    it('should read a file', async () => {
      let filePath = await getFixturePath(
        __dirname,
        'simple-package',
        'package.json'
      );
      let fileContents = await fs.readFile(filePath);
      expect(fileContents.toString()).toContain('fixture-basic');
    });
  });

  describe('writeFile()', () => {
    it('should write a file', async () => {
      let dirName = await createTempDir();
      let filePath = path.join(dirName, 'file.txt');
      await fs.writeFile(filePath, 'test');
      let fileContents = await fs.readFile(filePath);
      expect(fileContents.toString()).toBe('test');
    });
  });

  describe('rimraf()', () => {
    it('should delete a directory', async () => {
      let dirName = await createTempDir();
      let filePath = path.join(dirName, 'file.txt');
      await fs.writeFile(filePath, 'test');
      await fs.rimraf(dirName);
      await expect(fs.readFile(dirName)).rejects.toHaveProperty(
        'code',
        'ENOENT'
      );
      await expect(fs.readFile(filePath)).rejects.toHaveProperty(
        'code',
        'ENOENT'
      );
    });
  });

  describe('stat()', () => {
    it('should get the stats of a file', async () => {
      let fixturePath = await getFixturePath(
        __dirname,
        'simple-package',
        'package.json'
      );
      let stat = await fs.stat(fixturePath);
      expect(stat.isFile()).toBe(true);
      expect(stat.isDirectory()).toBe(false);
    });

    it('should get the stats of a directory', async () => {
      let fixturePath = await getFixturePath(__dirname, 'simple-package');
      let stat = await fs.stat(fixturePath);
      expect(stat.isFile()).toBe(false);
      expect(stat.isDirectory()).toBe(true);
    });
  });

  describe('lstat()', () => {
    it('should get the stats of a file', async () => {
      let fixturePath = await getFixturePath(
        __dirname,
        'simple-package',
        'package.json'
      );
      let stat = await fs.lstat(fixturePath);
      expect(stat.isFile()).toBe(true);
      expect(stat.isDirectory()).toBe(false);
    });

    it('should get the stats of a directory', async () => {
      let fixturePath = await getFixturePath(__dirname, 'simple-package');
      let stat = await fs.lstat(fixturePath);
      expect(stat.isFile()).toBe(false);
      expect(stat.isDirectory()).toBe(true);
    });
  });

  describe('symlink()', () => {
    afterEach(() => {
      process.platform = REAL_PLATFORM;
    });

    describe('posix', () => {
      beforeEach(() => {
        process.platform = 'linux';
      });

      it('should create a relative symlink to a directory', async () => {
        let tempDir = await createTempDir();
        let src = await getFixturePath(__dirname, 'symlinks', 'file.txt');
        let dest = path.resolve(tempDir, 'file.txt');
        await fs.symlink(src, dest, 'junction');
        let realPath = (await fs.readlink(dest)) || '';
        let resolved = path.join(path.dirname(dest), realPath);
        expect(resolved).toEqual(src);
      });

      it('should create a relative symlink to an executable file', async () => {
        let tempDir = await createTempDir();
        let src = await getFixturePath(__dirname, 'symlinks', 'executable.sh');
        let dest = path.resolve(tempDir, 'executable.sh');
        await fs.symlink(src, dest, 'exec');
        let realPath = (await fs.readlink(dest)) || '';
        let resolved = path.join(path.dirname(dest), realPath);
        expect(resolved).toEqual(src);
      });

      it('should overwrite an existing symlink', async () => {
        let tempDir = await createTempDir();
        let src1 = await getFixturePath(__dirname, 'symlinks', 'file.txt');
        let src2 = await getFixturePath(__dirname, 'symlinks', 'file2.txt');
        let dest = path.resolve(tempDir, 'file.txt');
        await fs.symlink(src1, dest, 'junction');
        await fs.symlink(src2, dest, 'junction');
        let realPath = (await fs.readlink(dest)) || '';
        let resolved = path.join(path.dirname(dest), realPath);
        expect(resolved).toEqual(src2);
      });
    });

    describe('windows', () => {
      beforeEach(() => {
        process.platform = 'win32';
      });

      it('should create a command shim to an executable file', async () => {
        let tempDir = await createTempDir();
        let src = await getFixturePath(__dirname, 'symlinks', 'executable.sh');
        let dest = path.resolve(tempDir, 'executable.sh');
        await fs.symlink(src, dest, 'exec');
        let files = await fs.readdir(tempDir);
        expect(files).toEqual(['executable.sh', 'executable.sh.cmd']);
      });

      it('should always use absolute paths when creating symlinks', async () => {
        let tempDir = await createTempDir();
        let src = await getFixturePath(__dirname, 'symlinks', 'file.txt');
        let dest = path.resolve(tempDir, 'file.txt');
        await fs.symlink(src, dest, 'junction');
        let files = await fs.readdir(tempDir);
        let realPath = await fs.readlink(dest);
        expect(realPath).toBe(src);
      });
    });
  });

  describe('readdir()', () => {
    it('should list a directory of files', async () => {
      let fixturePath = await getFixturePath(__dirname, 'simple-project');
      let files = await fs.readdir(fixturePath);
      expect(files).toEqual(['package.json', 'packages']);
    });
  });

  describe('readdirSafe()', () => {
    it('should list a directory of files', async () => {
      let fixturePath = await getFixturePath(__dirname, 'simple-project');
      let files = await fs.readdirSafe(fixturePath);
      expect(files).toEqual(['package.json', 'packages']);
    });

    it('should return an array if no directory exists', async () => {
      let fixturePath = path.join(__dirname, 'foo', 'bar', 'baz');
      let files = await fs.readdirSafe(fixturePath);
      expect(files).toEqual([]);
    });
  });

  describe('readlink()', () => {
    // ...
  });
});
