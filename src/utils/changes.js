// @flow
import Repository from '../Repository';
import Package from '../Package';
import * as git from '../utils/git';

async function getLastVersionCommitForPackage(repo: Repository, pkg: Package) {
  let cwd = repo.dir;
  let filePath = pkg.config.filePath;
  let commits = await git.getCommitsToFile(filePath, { cwd });
  let matchedCommit = null;

  for (let commit of commits) {
    let parentCommit = await git.getCommitParent(commit.hash, { cwd });
    if (!parentCommit) continue;

    let before = await git.showFileAtCommit(filePath, parentCommit, {
      cwd
    });
    let after = await git.showFileAtCommit(filePath, commit.hash, { cwd });

    let jsonBefore = JSON.parse(before);
    let jsonAfter = JSON.parse(after);

    if (jsonAfter.version !== jsonBefore.version) {
      matchedCommit = commit;
      break;
    }
  }

  return matchedCommit;
}

export async function getPackageVersionCommits(
  repo: Repository,
  packages: Array<Package>
) {
  let versionCommits = new Map();

  for (let pkg of packages) {
    let commit = await getLastVersionCommitForPackage(repo, pkg);
    versionCommits.set(pkg, commit);
  }

  return versionCommits;
}
