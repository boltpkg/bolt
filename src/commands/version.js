// @flow
import Project, { type DepGraph } from '../Project';
import Repository from '../Repository';
import Workspace from '../Workspace';
import DependencyGraph from '../DependencyGraph';
import * as options from '../utils/options';
import * as changes from '../utils/changes';
import * as git from '../utils/git';
import * as prompt from '../utils/prompt';
import * as versions from '../utils/versions';
import * as constants from '../constants';
import * as messages from '../utils/messages';
import { BoltError } from '../utils/errors';

export type VersionOptions = {
  cwd?: string
};

export function toVersionOptions(
  args: options.Args,
  flags: options.Flags
): VersionOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd')
  };
}

type IncrementTypeChoice = versions.IncrementType | 'skip';
type VersionChoice = 'diff' | IncrementTypeChoice;

type VersionChoices = Array<
  prompt.Separator | { name: messages.Message, value: VersionChoice }
>;

function getNextVersionOptions(
  currentVersion: versions.Version
): VersionChoices {
  let choices: VersionChoices = [];

  choices.push(
    {
      name: messages.skip(),
      value: 'skip'
    },
    {
      name: messages.diff(),
      value: 'diff'
    },
    prompt.separator()
  );

  if (versions.getPrereleaseType(currentVersion)) {
    choices.push({
      name: messages.prerelease(
        versions.increment(currentVersion, 'prerelease')
      ),
      value: 'prerelease'
    });
  }

  versions.VERSION_TYPES.forEach(versionType => {
    if (
      versionType === 'prerelease' &&
      !versions.getPrereleaseType(currentVersion)
    ) {
      return;
    }

    choices.push({
      name: versions.getIncrementMessage(currentVersion, versionType),
      value: versionType
    });
  });

  choices.push(prompt.separator());

  return choices;
}

async function workspaceDiff(workspace, versionCommits, repo, tty: boolean) {
  let versionCommit = versionCommits.get(workspace);

  if (!versionCommit) {
    versionCommit = git.MAGIC_EMPTY_STATE_COMMIT;
  }

  return await git.getDiffForPathSinceCommit(
    workspace.pkg.dir,
    versionCommit.hash,
    { cwd: repo.dir, tty }
  );
}

let prevIncrementTypeChoice: IncrementTypeChoice = 'patch';

async function getNextVersion(workspace, versionCommits, repo) {
  let name = workspace.pkg.config.getName();
  let currentVersionStr = workspace.pkg.config.getVersion();
  let currentVersion = versions.toVersion(currentVersionStr);
  let nextVersion = null;

  while (!nextVersion) {
    let choice: VersionChoice = await prompt.list(
      messages.selectVersion(name, currentVersionStr),
      getNextVersionOptions(currentVersion),
      { default: prevIncrementTypeChoice }
    );

    if (choice === 'diff') {
      await workspaceDiff(workspace, versionCommits, repo, true);
    } else if (choice === 'skip') {
      prevIncrementTypeChoice = 'skip';
      break;
    } else {
      prevIncrementTypeChoice = choice;
      nextVersion = versions.increment(currentVersion, choice);
    }
  }

  return nextVersion;
}

export async function version(opts: VersionOptions) {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let repo = await Repository.init(project.pkg.dir);
  let workspaces = await project.getWorkspaces();
  let graph = new DependencyGraph(project, workspaces);

  let status = await git.status({ cwd: repo.dir });

  if (status.length) {
    throw new BoltError(
      'Cannot run `bolt version` while you have a dirty tree:\n\n' +
        status
          .split('\n')
          .map(line => `  ${line}`)
          .join('\n')
    );
  }

  let versionCommits = await changes.getWorkspaceVersionCommits(
    repo,
    workspaces
  );

  let changedWorkspaces: Array<Workspace> = [];

  for (let workspace of workspaces) {
    let diff = await workspaceDiff(workspace, versionCommits, repo, false);
    if (diff.length) changedWorkspaces.push(workspace);
  }

  let newVersions: Map<Workspace, versions.IncrementType> = new Map();
  let dependentPackageQueue = [];

  for (let changedWorkspace of changedWorkspaces) {
    let nextVersion = await getNextVersion(
      changedWorkspace,
      versionCommits,
      repo
    );

    if (nextVersion) {
      newVersions.set(changedWorkspace, nextVersion);

      let node = graph.getDepsByWorkspace(changedWorkspace);
      if (!node) continue;

      for (let dependent of node.dependents) {
      }
    }
  }

  for (let [workspace, nextVersion] of newVersions) {
    console.log(workspace.pkg.config.getName(), nextVersion);
  }
}
