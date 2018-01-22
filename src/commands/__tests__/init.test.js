// @flow
import { init, toInitOptions } from '../init';
import * as yarn from '../../utils/yarn';
import * as prompts from '../../utils/prompts';
import Package from '../../Package';

jest.mock('../../utils/yarn');
jest.mock('../../utils/prompts');

const dummyPath = '/dummyPattern/dummyPath';
describe('bolt init', () => {
  it('should be able to pass yes to yarn when y flag is passed', async () => {
    await init(toInitOptions([], { cwd: dummyPath, y: true }));
    expect(yarn.cliCommand).toHaveBeenCalledWith(dummyPath, 'init', [
      '-s',
      '-y'
    ]);
  });

  it('should be able to pass yes to yarn when yes flag is passes', async () => {
    await init(toInitOptions([], { cwd: dummyPath, yes: true }));
    expect(yarn.cliCommand).toHaveBeenCalledWith(dummyPath, 'init', [
      '-s',
      '-y'
    ]);
  });

  it('should be able to pass private to yarn when p flag is passed', async () => {
    await init(toInitOptions([], { cwd: dummyPath, p: true }));
    expect(yarn.cliCommand).toHaveBeenCalledWith(dummyPath, 'init', [
      '-s',
      '-p'
    ]);
  });

  it('should be able to pass private to yarn when private flag is passes', async () => {
    await init(toInitOptions([], { cwd: dummyPath, private: true }));
    expect(yarn.cliCommand).toHaveBeenCalledWith(dummyPath, 'init', [
      '-s',
      '-p'
    ]);
  });

  it('should be able to pass yes and private to yarn when private and yes flag is passes', async () => {
    await init(toInitOptions([], { cwd: dummyPath, private: true, yes: true }));
    expect(yarn.cliCommand).toHaveBeenCalledWith(dummyPath, 'init', [
      '-s',
      '-p',
      '-y'
    ]);
  });

  it('should be able to add workspaces', async () => {
    await init(toInitOptions([], { cwd: dummyPath }));
    expect(prompts.isWorkspaceNeeded).toHaveBeenCalledTimes(1);
  });
});
