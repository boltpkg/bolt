// @flow
import fs from 'fs';
import path from 'path';
import _cmdShim from 'cmd-shim';
import promisify from 'typeable-promisify';
import makeDir from 'make-dir';

export function readFile(filePath: string): Promise<string> {
  return promisify(cb => fs.readFile(filePath, cb));
}

export function writeFile(filePath: string, fileContents: string): Promise<string> {
  return promisify(cb => fs.writeFile(filePath, fileContents, cb));
}

export function mkdirp(filePath: string): Promise<void> {
  return makeDir(filePath);
}

export function stat(filePath: string) {
  return promisify(cb => fs.stat(filePath, cb));
}

function lstat(filePath: string) {
  return promisify(cb => fs.lstat(filePath, cb));
}

function unlink(filePath: string) {
  return promisify(cb => fs.unlink(filePath, cb));
}

function symlink(src: string, dest: string, type: string) {
  return promisify(cb => fs.symlink(src, dest, type, cb));
}

function cmdShim(src: string, dest: string) {
  return promisify(cb => _cmdShim(src, dest, cb));
}

async function createSymbolicLink(src, dest, type) {
  try {
    await lstat(dest);
    await unlink(dest);
  } catch (err) {}
  await symlink(src, dest, type);
}

async function createPosixSymlink(origin, dest, type) {
  if (type === 'exec') {
    type = 'file';
  }

  const src = path.relative(path.dirname(dest), origin);

  return await createSymbolicLink(src, dest, type);
}

async function createWindowsSymlink(src, dest, type) {
  if (type === 'exec') {
    return await cmdShim(src, dest);
  } else {
    return await createSymbolicLink(src, dest, type);
  }
}

export async function symlink(src: string, dest: string, type: 'exec' | 'junction') {
  if (dest.includes(path.sep)) {
    await mkdirp(path.dirname(dest));
  }

  if (process.platform === 'win32') {
    return await createWindowsSymlink(src, dest, type);
  } else {
    return await createPosixSymlink(src, dest, type);
  }
}
