// @flow
import { unlink, toUnlinkOptions } from '../unlink';
import * as yarn from '../../utils/yarn';
import * as logger from '../../utils/logger';
import { copyFixtureIntoTempDir } from 'jest-fixtures';

jest.mock('../../utils/yarn');
jest.mock('../../utils/logger');

describe('bolt unlink', () => {
  let projectDir;
  beforeEach(async () => {
    projectDir = await copyFixtureIntoTempDir(
      __dirname,
      'package-with-external-deps-installed'
    );
  });

  it('should warn if unlink a internal package', async () => {
    await unlink(toUnlinkOptions(['foo'], { cwd: projectDir }));
    expect(logger.warn).toHaveBeenCalled();
  });

  it('should call yarn unlink if unlinking an external internal package', async () => {
    await unlink(toUnlinkOptions(['external-package'], { cwd: projectDir }));
    expect(yarn.unlink).toHaveBeenCalled();
  });

  it('should call yarn unlink for all external packages and warn for internal packages', async () => {
    await unlink(
      toUnlinkOptions(
        ['external-package', 'foo', 'bar', 'someother-external-package'],
        { cwd: projectDir }
      )
    );
    expect(logger.warn).toHaveBeenCalledTimes(2);
    expect(yarn.unlink).toHaveBeenCalledTimes(2);
  });
});
