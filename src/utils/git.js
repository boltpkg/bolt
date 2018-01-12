// Parts of this source are modified from lerna:
// lerna: https://github.com/lerna/lerna/blob/master/LICENSE
// @flow
import { BoltError } from './errors';
import * as logger from './logger';
import * as messages from './messages';
import * as processes from './processes';
import * as path from 'path';
import pLimit from 'p-limit';
import slash from 'slash';
import tempWrite from 'temp-write';
import * as os from 'os';

// We should never run more than one git command at a time, git enforces this
// for a lot of commands and will error.
const gitCommandLimit = pLimit(1);

const GIT_LOG_LINE_FORMAT_FLAG = '--pretty=format:%H %s';
const GIT_LOG_LINE_FORMAT_SPLITTER = /^([a-zA-Z0-9]+) (.*)/;

opaque type CommitHash = string;

export type Commit = {
  hash: CommitHash,
  message: string
};

function git(args: Array<string>, opts: processes.SpawnOptions) {
  return gitCommandLimit(() => {
    return processes.spawn('git', args, { silent: true, ...opts });
  });
}

function toGitPath(cwd: string, filePath: string) {
  return slash(path.relative(cwd, filePath));
}

function isGitFatalError(err) {
  return err.code === 128;
}

function linesToArray(lines: string) {
  return lines === '' ? [] : lines.split(os.EOL);
}

function formattedLogLinesToArray(lines: string): Array<Commit> {
  return linesToArray(lines).map(line => {
    let [, hash, message] = GIT_LOG_LINE_FORMAT_SPLITTER.exec(line);
    return { hash, message };
  });
}

export async function initRepository(opts: { cwd: string }) {
  await git(['init'], { cwd: opts.cwd });
}

export async function getRootDirectory(opts: { cwd: string }) {
  try {
    let { stdout } = await git(['rev-parse', '--show-toplevel'], {
      cwd: opts.cwd
    });
    return stdout.trim();
  } catch (err) {
    if (!isGitFatalError(err)) {
      throw err;
    }
  }
  return null;
}

export async function status(opts: { cwd: string }) {
  let { stdout } = await git(['status', '--porcelain'], {
    cwd: opts.cwd
  });
  return stdout.trim();
}

export async function addAll(opts: { cwd: string }) {
  await git(['add', '-A'], { cwd: opts.cwd });
}

export async function addFiles(
  filePaths: Array<string>,
  opts: { cwd: string }
) {
  let gitPaths = filePaths.map(filePath => toGitPath(opts.cwd, filePath));
  await git(['add', ...gitPaths], { cwd: opts.cwd });
}

export async function commit(message: string, opts: { cwd: string }) {
  let args = ['commit'];

  if (message.includes(os.EOL)) {
    args.push('-F', await tempWrite(message, 'bolt-commit.txt'));
  } else {
    args.push('-m', message);
  }

  await git(args, { cwd: opts.cwd });
}

export async function getAllCommits(opts: {
  cwd: string
}): Promise<Array<Commit>> {
  try {
    let { stdout } = await git(['log', '--pretty=format:%H %s'], {
      cwd: opts.cwd
    });
    return formattedLogLinesToArray(stdout.trim());
  } catch (err) {
    if (!isGitFatalError(err)) {
      throw err;
    }
  }
  return [];
}

export async function listTags(opts: { cwd: string }) {
  try {
    let { stdout } = await git(['tag'], { cwd: opts.cwd });
    return linesToArray(stdout.trim());
  } catch (err) {
    if (!isGitFatalError(err)) {
      throw err;
    }
  }
  return [];
}

export async function addTag(tagName: string, opts: { cwd: string }) {
  await git(['tag', tagName, '-m', tagName], { cwd: opts.cwd });
}

export async function removeTag(tagName: string, opts: { cwd: string }) {
  await git(['tag', '-d', tagName], { cwd: opts.cwd });
}

export async function getCommitsToFile(
  filePath: string,
  opts: { cwd: string }
): Promise<Array<Commit>> {
  let gitPath = toGitPath(opts.cwd, filePath);
  try {
    let { stdout } = await git(
      ['log', GIT_LOG_LINE_FORMAT_FLAG, '--follow', gitPath],
      {
        cwd: opts.cwd
      }
    );
    return formattedLogLinesToArray(stdout.trim());
  } catch (err) {
    if (!isGitFatalError(err)) {
      throw err;
    }
  }
  return [];
}

export async function getCommitParent(
  commitHash: CommitHash,
  opts: { cwd: string }
): Promise<CommitHash | null> {
  try {
    let { stdout } = await git(['rev-parse', `${commitHash}^`], {
      cwd: opts.cwd
    });
    return stdout.trim();
  } catch (err) {
    if (!isGitFatalError(err)) {
      throw err;
    }
  }
  return null;
}

export async function showFileAtCommit(
  filePath: string,
  commitHash: CommitHash,
  opts: { cwd: string }
) {
  let gitPath = toGitPath(opts.cwd, filePath);
  let { stdout } = await git(['show', `${commitHash}:${gitPath}`], {
    cwd: opts.cwd
  });
  return stdout;
}

export const MAGIC_EMPTY_STATE_HASH: CommitHash =
  '4b825dc642cb6eb9a060e54bf8d69288fbee4904';

export async function getDiffForPathSinceCommit(
  filePath: string,
  commitHash: CommitHash,
  opts: { cwd: string }
) {
  let gitPath = toGitPath(opts.cwd, filePath);
  let { stdout } = await git(
    ['diff', commitHash, '--color=always', '--', filePath],
    {
      cwd: opts.cwd
    }
  );
  return stdout.trim();
}
