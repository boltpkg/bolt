// @flow
import { test as test_, toTestOptions } from '../test';
import * as run_ from '../run';
import * as logger from '../../utils/logger';
import fixtures from 'fixturez';

const f = fixtures(__dirname);

jest.mock('../../utils/logger');
jest.mock('../run');

describe('bolt test', () => {
  let projectWithNoTestScriptDir;
  let projectWithTestScriptsDir;

  beforeEach(async () => {
    projectWithTestScriptsDir = f.copy('simple-project-with-scripts');
    projectWithNoTestScriptDir = f.copy('project-with-bins');
  });

  it('should call run with test script', async () => {
    await test_(
      toTestOptions([], {
        cwd: projectWithTestScriptsDir
      })
    );
    expect(run_.run).toHaveBeenCalledWith({
      cwd: projectWithTestScriptsDir,
      script: 'test',
      scriptArgs: []
    });
  });

  it('should call run with default script which is jest and logs warning', async () => {
    await test_(
      toTestOptions([], {
        cwd: projectWithNoTestScriptDir
      })
    );

    expect(run_.run).toHaveBeenCalledWith({
      cwd: projectWithNoTestScriptDir,
      script: 'jest',
      scriptArgs: []
    });
    expect(logger.warn).toHaveBeenCalled();
  });
});
