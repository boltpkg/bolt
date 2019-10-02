// @flow
import { help, toHelpOptions } from '../help';
import * as messages from '../../utils/messages';

describe('bolt help', () => {
  let consoleLogSpy;
  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it('should return the default help message when no subcommand is passed', async () => {
    await help(toHelpOptions([], {}));
    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    expect(consoleLogSpy).toHaveBeenCalledWith(messages.helpContent());
  });

  it('should throw an error when called with a subcommand', async () => {
    await expect(help(toHelpOptions(['install'], {}))).rejects.toBeInstanceOf(
      Error
    );
    expect(consoleLogSpy).toHaveBeenCalledTimes(0);
  });
});
