import cli from '../cli';
import * as commands from '../commands';
import { globalOptions } from '../GlobalOptions';

jest.mock('../commands');
jest.mock('../utils/logger');
jest.mock('../GlobalOptions', () => ({
  globalOptions: {
    setFromFlags: jest.fn()
  }
}));

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
  describe('global flags', () => {
    it('should parse global flags before a command', async () => {
      const opts = {};
      mockedCommands.toAddOptions.mockImplementationOnce(() => opts);
      await cli(['--no-prefix', 'add', 'foo']);
      expect(mockedCommands.toAddOptions).toHaveBeenCalledWith(['foo'], {
        prefix: false
      });
      expect(commands.add).toHaveBeenCalledTimes(1);
      expect(commands.add).toHaveBeenCalledWith(opts);
    });
    it('should parse global flags after a command', async () => {
      const opts = {};
      mockedCommands.toAddOptions.mockImplementationOnce(() => opts);
      await cli(['add', 'foo', '--no-prefix']);
      expect(mockedCommands.toAddOptions).toHaveBeenCalledWith(['foo'], {
        prefix: false
      });
      expect(commands.add).toHaveBeenCalledTimes(1);
      expect(commands.add).toHaveBeenCalledWith(opts);
    });
    it('should set global flags in globalOptions store', async () => {
      expect(globalOptions.setFromFlags).not.toHaveBeenCalled();
      await cli(['add', 'foo', '--no-prefix']);
      expect(globalOptions.setFromFlags).toHaveBeenCalledTimes(1);
      expect(globalOptions.setFromFlags).toHaveBeenCalledWith({
        prefix: false
      });
    });
  });
  describe('passing flags to run commands', () => {
    it('bolt script --flag1 --flag2', async () => {
      const opts = {};
      mockedCommands.toRunOptions.mockImplementationOnce(() => opts);
      await cli(['script', '--flag1', '--flag2']);
      expect(mockedCommands.toRunOptions).toHaveBeenCalledWith(['script'], {
        flag1: true,
        flag2: true
      });
      expect(commands.run).toHaveBeenCalledTimes(1);
      expect(commands.run).toHaveBeenCalledWith(opts);
    });
    it('bolt run script --flag1 --flag2', async () => {
      const opts = {};
      mockedCommands.toRunOptions.mockImplementationOnce(() => opts);
      await cli(['run', 'script', '--flag1', '--flag2']);
      expect(mockedCommands.toRunOptions).toHaveBeenCalledWith(['script'], {
        flag1: true,
        flag2: true
      });
      expect(commands.run).toHaveBeenCalledTimes(1);
      expect(commands.run).toHaveBeenCalledWith(opts);
    });
    it('bolt p run script --flag1 --flag2', async () => {
      const opts = {};
      mockedCommands.toProjectRunOptions.mockImplementationOnce(() => opts);
      await cli(['p', 'run', 'script', '--flag1', '--flag2']);
      expect(mockedCommands.toProjectRunOptions).toHaveBeenCalledWith(
        ['script'],
        {
          flag1: true,
          flag2: true
        }
      );
      expect(commands.projectRun).toHaveBeenCalledTimes(1);
      expect(commands.projectRun).toHaveBeenCalledWith(opts);
    });
    it('bolt w my-package run script --flag1 --flag2', async () => {
      const opts = {};
      mockedCommands.toWorkspaceRunOptions.mockImplementationOnce(() => opts);
      await cli(['w', 'my-package', 'run', 'script', '--flag1', '--flag2']);
      expect(mockedCommands.toWorkspaceRunOptions).toHaveBeenCalledWith(
        ['my-package', 'script'],
        {
          flag1: true,
          flag2: true
        }
      );
      expect(commands.workspaceRun).toHaveBeenCalledTimes(1);
      expect(commands.workspaceRun).toHaveBeenCalledWith(opts);
    });
    it('bolt ws --only="my-package" run script -- --flag1 --flag2', async () => {
      const opts = {};
      mockedCommands.toWorkspacesRunOptions.mockImplementationOnce(() => opts);
      await cli([
        'ws',
        '--only=my-package',
        'run',
        'script',
        '--',
        '--flag1',
        '--flag2'
      ]);
      expect(mockedCommands.toWorkspacesRunOptions).toHaveBeenCalledWith(
        ['script'],
        {
          '--': ['--flag1', '--flag2'],
          only: 'my-package'
        }
      );
      expect(commands.workspacesRun).toHaveBeenCalledTimes(1);
      expect(commands.workspacesRun).toHaveBeenCalledWith(opts);
    });
    it('bolt ws exec --only="my-package" -- yarn script  --flag1 --flag2', async () => {
      const opts = {};
      mockedCommands.toWorkspacesExecOptions.mockImplementationOnce(() => opts);
      await cli([
        'ws',
        'exec',
        '--only=my-package',
        '--',
        'yarn',
        'script',
        '--flag1',
        '--flag2'
      ]);
      expect(mockedCommands.toWorkspacesExecOptions).toHaveBeenCalledWith([], {
        '--': ['yarn', 'script', '--flag1', '--flag2'],
        only: 'my-package'
      });
      expect(commands.workspacesExec).toHaveBeenCalledTimes(1);
      expect(commands.workspacesExec).toHaveBeenCalledWith(opts);
    });
  });
});
