// @flow
import { info, toInfoOptions } from '../info';

import * as yarn from '../../utils/yarn';

jest.mock('../../utils/yarn');

describe('bolt info', () => {
  test('should return the expected cwd', () => {
    const args = [];
    const cwd = 'dummy/path/to/dir';
    const flags = { cwd };
    const result = toInfoOptions(args, flags);
    expect(result.cwd).toBe(cwd);
  });

  test('should return the expected argument', () => {
    const args = ['react'];
    const flags = {};
    const result = toInfoOptions(args, flags);
    expect(result.args).toBe(args);
  });

  test('should return the expected flags', () => {
    const commandArgs = [];
    const flags = { json: true };
    const result = toInfoOptions(commandArgs, flags);
    expect(result.flags).toBe(flags);
  });

  test('should call npm login once', async () => {
    const cwd = 'dummy/path/to/dir';
    const args = ['react'];
    const opt = { cwd, args };
    await info(opt);
    expect(yarn.info).toHaveBeenCalledTimes(1);
  });
});
