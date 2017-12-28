// // @flow
// import { version, toVersionOptions } from '../version';
// import { copyFixtureIntoTempDir } from 'jest-fixtures';
// import * as git from '../../utils/git';
// import * as fs from '../../utils/fs';
// import { BoltError } from '../../utils/errors';
// import * as path from 'path';
// import Project from '../../Project';
// import * as semver from 'semver';
//
// describe('bolt version', () => {
//   test('dirty tree', async () => {
//     let cwd = await copyFixtureIntoTempDir(__dirname, 'simple-repo');
//     let opts = toVersionOptions([], { cwd });
//
//     // unstaged
//     await git.initRepository({ cwd });
//     await expect(version(opts)).rejects.toBeInstanceOf(BoltError);
//
//     // staged
//     await git.addAll({ cwd });
//     await expect(version(opts)).rejects.toBeInstanceOf(BoltError);
//
//     // unstaged on top of commit
//     await git.commit('init', { cwd });
//     await fs.writeFile(path.join(cwd, 'foo'), '');
//     await expect(version(opts)).rejects.toBeInstanceOf(BoltError);
//   });
//
//   test('clean tree, no prev version commits', async () => {
//     let cwd = await copyFixtureIntoTempDir(__dirname, 'simple-repo');
//
//     let opts = toVersionOptions([], { cwd });
//     let project = await Project.init(cwd);
//     let workspaces = await project.getWorkspaces();
//
//     await git.initRepository({ cwd });
//     await git.addAll({ cwd });
//     await git.commit('init', { cwd });
//
//     await Promise.all(
//       workspaces.slice(0, 1).map(async workspace => {
//         let json = workspace.pkg.config.getConfig();
//         await workspace.pkg.config.write({
//           ...json,
//           version: semver.inc(json.version, 'major')
//         });
//       })
//     );
//
//     await git.addAll({ cwd });
//     await git.commit('bump', { cwd });
//
//     await version(opts);
//   });
// });
