// @flow
import { unlink } from '../unlink';
import * as yarn from '../../utils/yarn';
import * as logger from '../../utils/logger';
import fixtures from 'fixturez';

const f = fixtures(__dirname);

jest.mock('../../utils/yarn');
jest.mock('../../utils/logger');

describe('bolt unlink', () => {
  let projectDir;

  beforeEach(() => {
    projectDir = f.copy('package-with-external-deps-installed');
  });

  it('should warn if unlink a internal package', async () => {
    await unlink({ cwd: projectDir }, ['foo']);
    expect(logger.warn).toHaveBeenCalled();
  });

  it('should call yarn unlink if unlinking an external internal package', async () => {
    await unlink({ cwd: projectDir }, ['external-package']);
    expect(yarn.cliCommand).toHaveBeenCalled();
  });

  it('should call yarn unlink for all external packages and warn for internal packages', async () => {
    await unlink({ cwd: projectDir }, [
      'external-package',
      'foo',
      'bar',
      'someother-external-package'
    ]);
    expect(logger.warn).toHaveBeenCalledTimes(2);
    expect(yarn.cliCommand).toHaveBeenCalledTimes(2);
  });
});
