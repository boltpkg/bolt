// @flow
import { link, toLinkOptions } from '../link';
import * as yarn from '../../utils/yarn';
import * as logger from '../../utils/logger';
import fixtures from 'fixturez';

const f = fixtures(__dirname);

jest.mock('../../utils/yarn');
jest.mock('../../utils/logger');

describe('bolt link', () => {
  let projectDir;

  beforeEach(() => {
    projectDir = f.copy('package-with-external-deps-installed');
  });

  it('should show warning on linking internal dependency', async () => {
    await link({ cwd: projectDir }, ['foo']);
    expect(logger.warn).toHaveBeenCalled();
  });

  it('should call yarn link for extenal package', async () => {
    await link({ cwd: projectDir }, ['some-external-package']);
    expect(yarn.cliCommand).toHaveBeenCalled();
  });

  it('should call yarn link for all extenal package and show warning for all internal dependency', async () => {
    await link({ cwd: projectDir }, [
      'some-external-package',
      'foo',
      'bar',
      'someother-external-dependency'
    ]);
    expect(yarn.cliCommand).toHaveBeenCalledTimes(2);
    expect(logger.warn).toHaveBeenCalledTimes(2);
  });
});
