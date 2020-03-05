// @flow
import { info, toInfoOptions } from '../info';

import * as yarn from '../../utils/yarn';

jest.mock('../../utils/yarn');

const cwd = 'dummy/path/to/dir';
const args = ['react'];
const flags = { cwd, json: true };
const opt = { flags, args };

describe('bolt info', () => {
  test('should return the expected cwd', () => {
    let result = toInfoOptions(args, flags);
    expect(result.cwd).toBe(cwd);
  });

  test('should return the expected argument', () => {
    let result = toInfoOptions(args, flags);
    expect(result.args).toBe(args);
  });

  test('should return the expected flags', () => {
    let result = toInfoOptions(args, flags);
    expect(result.flags).toBe(flags);
  });

  test('should call npm login once', async () => {
    await info(opt);
    expect(yarn.info).toHaveBeenCalledTimes(1);
  });
});
