// @flow
import projectBinPath from 'project-bin-path';
import * as path from 'path';
import * as yarn from '../yarn';
import * as processes from '../processes';
import Project from '../../Project';
import * as constants from '../../constants';
import fixtures from 'fixturez';
import containDeep from 'jest-expect-contain-deep';

const f = fixtures(__dirname);

jest.mock('../processes');

async function getLocalYarnPath(): Promise<string> {
  const boltBinDir = await projectBinPath();
  return path.join(boltBinDir, 'yarn');
}
const unsafeProcesses: any & typeof processes = processes;
const unsafeConstants: any & typeof constants = constants;

function assertSpawnCalls(expectedProcess, expectedArgs, expectedCwd) {
  // Filter out the spawn call to get user agent which occurs before the yarn call
  // itself
  let spawnCalls = unsafeProcesses.spawn.mock.calls.filter(
    c => !(c.length >= 2 && c[1].join(' ') === 'config get user-agent')
  );

  expect(spawnCalls.length).toEqual(1);
  expect(spawnCalls[0][0]).toEqual(expectedProcess);
  expect(spawnCalls[0][1]).toEqual(expectedArgs);
  expect(spawnCalls[0][2].cwd).toEqual(expectedCwd);
}

let yarnUserAgent = 'yarn/7.7.7 npm/? node/v8.9.4 darwin x64';

describe('utils/yarn', () => {
  beforeEach(() => {
    unsafeProcesses.spawn.mockReturnValueOnce(Promise.resolve({ stdout: '' }));
  });
  describe('install()', () => {
    it('should call local yarn install', async () => {
      const cwd = 'a/fake/path';
      const localYarn = await getLocalYarnPath();
      await yarn.install(cwd);
      expect(unsafeProcesses.spawn).toHaveBeenCalledWith(
        localYarn,
        ['install'],
        expect.objectContaining({ cwd })
      );
    });

    it('should pass on lockfile flag only if requested', async () => {
      const cwd = 'a/fake/path';
      const localYarn = await getLocalYarnPath();
      await yarn.install(cwd);
      expect(unsafeProcesses.spawn).toHaveBeenCalledWith(
        localYarn,
        ['install'],
        expect.objectContaining({ cwd })
      );
    });

    it('should pass on pure-lockfile flag', async () => {
      const cwd = 'a/fake/path';
      const localYarn = await getLocalYarnPath();
      await yarn.install(cwd, 'pure');
      expect(unsafeProcesses.spawn).toHaveBeenCalledWith(
        localYarn,
        ['install', '--pure-lockfile'],
        expect.objectContaining({ cwd })
      );
    });

    it('should pass on frozenlockfile flag', async () => {
      const cwd = 'a/fake/path';
      const localYarn = await getLocalYarnPath();
      await yarn.install(cwd, 'frozen');
      expect(unsafeProcesses.spawn).toHaveBeenCalledWith(
        localYarn,
        ['install', '--frozen-lockfile'],
        expect.objectContaining({ cwd })
      );
    });

    it('should append the bolt version to yarns npm_config_user_agent string', async () => {
      const cwd = 'a/fake/path';
      unsafeConstants.BOLT_VERSION = '9.9.9';
      const yarnUserAgent = 'yarn/7.7.7 npm/? node/v8.9.4 darwin x64';
      const boltUserAgent =
        'bolt/9.9.9 yarn/7.7.7 npm/? node/v8.9.4 darwin x64';
      const localYarn = await getLocalYarnPath();
      unsafeProcesses.spawn.mockReset();
      unsafeProcesses.spawn.mockReturnValueOnce(
        Promise.resolve({ stdout: yarnUserAgent })
      );

      await yarn.install(cwd);
      expect(unsafeProcesses.spawn).toHaveBeenCalledWith(
        localYarn,
        ['install'],
        containDeep({
          env: { npm_config_user_agent: boltUserAgent }
        })
      );
    });

    it('should pass existing environment variables to yarn during install', async () => {
      const cwd = 'a/fake/path';
      const localYarn = await getLocalYarnPath();
      process.env.TEST_CANARY = 'HERE';

      await yarn.install(cwd);
      expect(unsafeProcesses.spawn).toHaveBeenCalledWith(
        localYarn,
        ['install'],
        containDeep({
          env: {
            TEST_CANARY: 'HERE'
          }
        })
      );
      delete process.env.TEST_CANARY;
    });

    it('should add bolt_config_user_agent environment variable during install', async () => {
      const cwd = 'a/fake/path';
      unsafeConstants.BOLT_VERSION = '9.9.9';
      const yarnUserAgent = 'yarn/7.7.7 npm/? node/v8.9.4 darwin x64';
      const boltUserAgent =
        'bolt/9.9.9 yarn/7.7.7 npm/? node/v8.9.4 darwin x64';
      const localYarn = await getLocalYarnPath();
      unsafeProcesses.spawn.mockReset();
      unsafeProcesses.spawn.mockReturnValueOnce(
        Promise.resolve({ stdout: yarnUserAgent })
      );

      await yarn.install(cwd);
      expect(unsafeProcesses.spawn).toHaveBeenCalledWith(
        localYarn,
        ['install'],
        containDeep({
          env: { bolt_config_user_agent: boltUserAgent }
        })
      );
    });
  });

  describe('add()', () => {
    let cwd;
    let project;
    let localYarn;

    beforeEach(async () => {
      cwd = f.find('simple-project');
      project = await Project.init(cwd);
      localYarn = await getLocalYarnPath();
    });

    it('should be able to add a dependency', async () => {
      await yarn.add(project.pkg, [{ name: 'chalk' }]);
      assertSpawnCalls(localYarn, ['add', 'chalk'], cwd);
    });

    it('should be able to add a dev dependency', async () => {
      await yarn.add(project.pkg, [{ name: 'chalk' }], 'devDependencies');
      assertSpawnCalls(localYarn, ['add', 'chalk', '--dev'], cwd);
    });

    it('should be able to add a peer dependency', async () => {
      await yarn.add(project.pkg, [{ name: 'chalk' }], 'peerDependencies');
      assertSpawnCalls(localYarn, ['add', 'chalk', '--peer'], cwd);
    });

    it('should be able to add an optional dependency', async () => {
      await yarn.add(project.pkg, [{ name: 'chalk' }], 'optionalDependencies');
      assertSpawnCalls(localYarn, ['add', 'chalk', '--optional'], cwd);
    });

    it('should be able to add dependency with versions', async () => {
      await yarn.add(project.pkg, [{ name: 'chalk', version: '^1.0.0' }]);
      assertSpawnCalls(localYarn, ['add', 'chalk@^1.0.0'], cwd);
    });

    it('should be able to add multiple dependencies', async () => {
      await yarn.add(project.pkg, [{ name: 'chalk' }, { name: 'left-pad' }]);
      assertSpawnCalls(localYarn, ['add', 'chalk', 'left-pad'], cwd);
    });

    it('should add bolt_config_user_agent environment variable', async () => {
      unsafeConstants.BOLT_VERSION = '9.9.9';
      const yarnUserAgent = 'yarn/7.7.7 npm/? node/v8.9.4 darwin x64';
      const boltUserAgent =
        'bolt/9.9.9 yarn/7.7.7 npm/? node/v8.9.4 darwin x64';
      const localYarn = await getLocalYarnPath();
      unsafeProcesses.spawn.mockReset();
      unsafeProcesses.spawn.mockReturnValueOnce(
        Promise.resolve({ stdout: yarnUserAgent })
      );

      await yarn.add(project.pkg, [{ name: 'chalk' }]);
      expect(unsafeProcesses.spawn).toHaveBeenCalledWith(
        localYarn,
        ['add', 'chalk'],
        containDeep({
          env: { bolt_config_user_agent: boltUserAgent }
        })
      );
    });
  });
  describe('upgrade()', () => {
    let cwd;
    let project;
    let localYarn;

    beforeEach(async () => {
      cwd = f.find('simple-project');
      project = await Project.init(cwd);
      localYarn = await getLocalYarnPath();
    });

    it('should call local yarn upgrade', async () => {
      await yarn.upgrade(project.pkg);
      expect(unsafeProcesses.spawn).toHaveBeenCalledWith(
        localYarn,
        ['upgrade'],
        expect.objectContaining({ cwd })
      );
    });

    it('should upgrade a specific package', async () => {
      await yarn.upgrade(project.pkg, [{ name: 'foo' }]);
      expect(unsafeProcesses.spawn).toHaveBeenCalledWith(
        localYarn,
        ['upgrade', 'foo'],
        expect.objectContaining({ cwd })
      );
    });

    it('should upgrade a specific package to a specific version', async () => {
      await yarn.upgrade(project.pkg, [{ name: 'foo', version: '^5.0.1' }]);
      expect(unsafeProcesses.spawn).toHaveBeenCalledWith(
        localYarn,
        ['upgrade', 'foo@^5.0.1'],
        expect.objectContaining({ cwd })
      );
    });

    it('should upgrade multiple packages', async () => {
      await yarn.upgrade(project.pkg, [
        { name: 'foo', version: '^5.0.1' },
        { name: 'bar', version: '~2.1' }
      ]);
      expect(unsafeProcesses.spawn).toHaveBeenCalledWith(
        localYarn,
        ['upgrade', 'foo@^5.0.1', 'bar@~2.1'],
        expect.objectContaining({ cwd })
      );
    });

    it('should add bolt_config_user_agent environment variable', async () => {
      unsafeConstants.BOLT_VERSION = '9.9.9';
      await yarn.upgrade(project.pkg);
      expect(unsafeProcesses.spawn).toHaveBeenCalledWith(
        localYarn,
        ['upgrade'],
        containDeep({
          env: { bolt_config_user_agent: expect.stringContaining('bolt/9.9.9') }
        })
      );
    });
  });
  describe('run()', () => {
    let cwd;
    let project;
    let localYarn;

    beforeEach(async () => {
      cwd = f.find('simple-project');
      project = await Project.init(cwd);
      localYarn = await getLocalYarnPath();
    });

    it('should call local yarn run', async () => {
      await yarn.run(project.pkg, 'foo');
      const relativeYarn = path.relative(project.pkg.dir, localYarn);
      expect(unsafeProcesses.spawn).toHaveBeenCalledWith(
        relativeYarn,
        ['run', '-s', 'foo'],
        expect.objectContaining({ cwd })
      );
    });
    it('should add bolt_config_user_agent environment variable', async () => {
      unsafeConstants.BOLT_VERSION = '9.9.9';
      await yarn.run(project.pkg, 'foo');
      const relativeYarn = path.relative(project.pkg.dir, localYarn);
      expect(unsafeProcesses.spawn).toHaveBeenCalledWith(
        relativeYarn,
        ['run', '-s', 'foo'],
        containDeep({
          env: { bolt_config_user_agent: expect.stringContaining('bolt/9.9.9') }
        })
      );
    });
  });
  describe('remove()', () => {
    let cwd;
    let localYarn;

    beforeEach(async () => {
      cwd = f.find('simple-project');
      localYarn = await getLocalYarnPath();
    });

    it('should call local yarn remove', async () => {
      await yarn.remove(['foo'], cwd);
      expect(unsafeProcesses.spawn).toHaveBeenCalledWith(
        localYarn,
        ['remove', 'foo'],
        expect.objectContaining({ cwd })
      );
    });

    it('should remove multiple dependencies', async () => {
      await yarn.remove(['foo', 'bar'], cwd);
      expect(unsafeProcesses.spawn).toHaveBeenCalledWith(
        localYarn,
        ['remove', 'foo', 'bar'],
        expect.objectContaining({ cwd })
      );
    });

    it('should add bolt_config_user_agent environment variable', async () => {
      unsafeConstants.BOLT_VERSION = '9.9.9';
      await yarn.remove(['foo'], cwd);
      expect(unsafeProcesses.spawn).toHaveBeenCalledWith(
        localYarn,
        ['remove', 'foo'],
        containDeep({
          env: { bolt_config_user_agent: expect.stringContaining('bolt/9.9.9') }
        })
      );
    });
  });
  describe('info()', () => {
    let cwd;
    let localYarn;

    beforeEach(async () => {
      cwd = f.find('simple-project');
      localYarn = await getLocalYarnPath();
    });

    it('should call local yarn info', async () => {
      await yarn.info(cwd, ['package']);
      expect(unsafeProcesses.spawn).toHaveBeenCalledWith(
        localYarn,
        ['info', 'package'],
        expect.objectContaining({ cwd })
      );
    });
    it('should add bolt_config_user_agent environment variable', async () => {
      unsafeConstants.BOLT_VERSION = '9.9.9';
      await yarn.info(cwd, ['package']);
      expect(unsafeProcesses.spawn).toHaveBeenCalledWith(
        localYarn,
        ['info', 'package'],
        containDeep({
          env: { bolt_config_user_agent: expect.stringContaining('bolt/9.9.9') }
        })
      );
    });
  });

  describe('cliCommand()', () => {
    let localYarn;
    beforeEach(async () => {
      localYarn = await getLocalYarnPath();
    });
    it('should be able to handle spawnArgs', async () => {
      await yarn.cliCommand('dummyPattern/dummyPath', 'test', ['jest']);
      assertSpawnCalls(localYarn, ['test', 'jest'], 'dummyPattern/dummyPath');
    });
    it('should be able to handle empty spawnArgs', async () => {
      await yarn.cliCommand('dummyPattern/dummyPath', 'test', []);
      assertSpawnCalls(localYarn, ['test'], 'dummyPattern/dummyPath');
    });

    it('should add bolt_config_user_agent environment variable', async () => {
      unsafeConstants.BOLT_VERSION = '9.9.9';
      await yarn.cliCommand('dummyPattern/dummyPath', 'test', ['jest']);
      expect(unsafeProcesses.spawn).toHaveBeenCalledWith(
        localYarn,
        ['test', 'jest'],
        containDeep({
          env: { bolt_config_user_agent: expect.stringContaining('bolt/9.9.9') }
        })
      );
    });
  });

  describe('userAgent()', () => {
    it('should strip empty lines from the spawned yarn process stdout', async () => {
      let expectedUserAgent = 'yarn/7.7.7 npm/? node/v8.9.4 darwin x64';
      let stdout = `

${expectedUserAgent}
`;

      unsafeProcesses.spawn.mockReset();
      unsafeProcesses.spawn.mockReturnValueOnce(Promise.resolve({ stdout }));
      expect(await yarn.userAgent()).toBe(expectedUserAgent);
    });
  });
});
