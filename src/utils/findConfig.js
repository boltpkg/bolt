// @flow
import pkgUp from 'pkg-up';

export default async function findConfig(filePath: string): Promise<?string> {
  return await pkgUp(filePath);
}
