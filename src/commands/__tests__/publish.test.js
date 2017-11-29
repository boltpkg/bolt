// @flow
import { getFixturePath } from 'jest-fixtures';
import { publish, toPublishOptions } from '../publish';
import * as locks from '../../utils/locks';
import * as npm from '../../utils/npm';

jest.mock('../../utils/logger');
jest.mock('../../utils/locks');
jest.mock('../../utils/npm');

const untypedNpm: any = npm;

describe('bolt publish', () => {
  let lockSpy;
  let unlockSpy;
  let npmPublishSpy;

  beforeEach(() => {
    lockSpy = jest.spyOn(locks, 'lock');
    unlockSpy = jest.spyOn(locks, 'unlock');
    npmPublishSpy = jest.spyOn(npm, 'publish');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // test('should lock all workspaces', async () => {
  //   const cwd = await getFixturePath(__dirname, 'simple-project');
  //   await publish({ cwd });

  //   expect(lockSpy).toHaveBeenCalledTimes(1);
  //   // should have been called with two packages passed in
  //   expect(lockSpy.mock.calls[0][0].length).toEqual(2);
  // });

  // test('should unlock all workspaces', async () => {
  //   const cwd = await getFixturePath(__dirname, 'simple-project');
  //   await publish({ cwd });

  //   expect(unlockSpy).toHaveBeenCalledTimes(1);
  //   // should have been called with two packages passed in
  //   expect(unlockSpy.mock.calls[0][0].length).toEqual(2);
  // });

  test('should run publish on all unpublished packages', async () => {
    untypedNpm.__mockInfoAllow404('foo', { published: false, pkgInfo: {} });
    const cwd = await getFixturePath(__dirname, 'simple-project');

    await publish({ cwd });
    expect(npmPublishSpy).toHaveBeenCalledTimes(1);
  });
  test('should return publishedPackages', async () => {
    untypedNpm.__mockInfoAllow404('foo', { published: false, pkgInfo: {} });
    const cwd = await getFixturePath(__dirname, 'simple-project');
    untypedNpm.publish.mockReturnValueOnce({ published: true });
    const published = await publish({ cwd });
    expect(untypedNpm.publish).toHaveBeenCalledTimes(1);

    expect(published).toEqual([
      { name: 'foo', newVersion: '1.0.0', published: true }
    ]);
  });
  test('should return published false if it fails', async () => {
    untypedNpm.__mockInfoAllow404('foo', { published: false, pkgInfo: {} });
    const cwd = await getFixturePath(__dirname, 'simple-project');
    untypedNpm.publish.mockReturnValueOnce({ published: false });
    const published = await publish({ cwd });
    expect(untypedNpm.publish).toHaveBeenCalledTimes(1);

    expect(published).toEqual([
      { name: 'foo', newVersion: '1.0.0', published: false }
    ]);
  });
});
