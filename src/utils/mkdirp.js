// @flow
import _mkdirp from 'mkdirp';
import promisify from 'typeable-promisify';

export default function mkdirp(dir: string) {
  return promisify(cb => _mkdirp(dir, cb));
}
