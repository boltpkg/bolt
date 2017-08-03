// @flow
import * as fs from 'fs';
import * as path from 'path';
import promisify from 'typeable-promisify';
import cmdShim from 'cmd-shim';
import mkdirp from 'mkdirp';

const lstatAsync = (filePath: string) => {
  return promisify(cb => fs.lstat(filePath, cb));
};

const unlinkAsync = (filePath: string) => {
  return promisify(cb => fs.unlink(filePath, cb));
};

const symlinkAsync = (src: string, dest: string, type: string) => {
  return promisify(cb => fs.symlink(src, dest, type, cb));
};

const cmdShimAsync = (src: string, dest: string) => {
  return promisify(cb => cmdShim(src, dest, cb));
};

async function createSymbolicLink(src, dest, type) {
  try {
    await lstatAsync(dest);
    await unlinkAsync(dest);
  } catch (err) {}
  await symlinkAsync(src, dest, type);
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
    return await cmdShimAsync(src, dest);
  } else {
    return await createSymbolicLink(src, dest, type);
  }
}

export default async function symlink(src: string, dest: string, type: 'exec' | 'junction') {
  if (dest.includes(path.sep)) {
    await mkdirp(path.dirname(dest));
  }

  if (process.platform === 'win32') {
    return await createWindowsSymlink(src, dest, type);
  } else {
    return await createPosixSymlink(src, dest, type);
  }
}
