import cli from '../cli';
import * as commands from '../commands';

jest.mock('../commands');
jest.mock('../utils/logger');

const mockedCommands: any = commands;

describe('cli', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe('--help flag', () => {
    it('should run help command if --help flag is passed with no command args', async () => {
      const opts = {};
      mockedCommands.toHelpOptions.mockImplementationOnce(() => opts);
      await cli(['--help']);
      expect(mockedCommands.toHelpOptions).toHaveBeenCalledWith([], {
        help: true
      });
      expect(commands.help).toHaveBeenCalledTimes(1);
      expect(commands.help).toHaveBeenCalledWith(opts);
    });

    it('should not run the help command if --help flag is passed WITH command args', async () => {
      await cli(['install', '--help']);
      expect(commands.help).not.toHaveBeenCalled();
    });
  });

  describe('commands', () => {
    it('should run install command if no command args passed', async () => {
      const opts = {};
      mockedCommands.toInstallOptions.mockImplementationOnce(() => opts);
      await cli([]);
      expect(mockedCommands.toInstallOptions).toHaveBeenCalledWith([], {});
      expect(commands.install).toHaveBeenCalledTimes(1);
      expect(commands.install).toHaveBeenCalledWith(opts);
    });

    it('should run add command when "add" command is passed', async () => {
      const opts = {};
      mockedCommands.toAddOptions.mockImplementationOnce(() => opts);
      await cli(['add', 'foo', '--dev']);
      expect(mockedCommands.toAddOptions).toHaveBeenCalledWith(['foo'], {
        dev: true
      });
      expect(commands.add).toHaveBeenCalledTimes(1);
      expect(commands.add).toHaveBeenCalledWith(opts);
    });
  });
});
