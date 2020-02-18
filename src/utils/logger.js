// @flow
import chalk from 'chalk';
import type Package from '../Package';
import { toString, type Message } from './messages';

type LoggerOpts = {
  prefix?: string | false,
  emoji?: string
};

function fmt(str: Message | Buffer | string, opts: LoggerOpts = {}) {
  let result = toString(str);

  let prefix = opts.prefix || '';

  if (opts.emoji) {
    prefix = `${opts.emoji}  ${prefix}`;
  }

  if (prefix) {
    result = result
      .trimRight()
      .split('\n')
      .map(line => `${prefix} ${line}`)
      .join('\n');
  }

  return result;
}

function prompt(pkg, cmd) {
  let prompt = pkg ? '(' + pkg.config.getName() + ')' : '';
  if (!cmd) {
    return prompt;
  }
  return prompt + ' $ ' + cmd;
}

function write(
  message: Message | Buffer | string,
  opts: LoggerOpts = {},
  err: boolean = false
) {
  if (err) {
    console.error(fmt(message, opts));
  } else {
    console.log(fmt(message, opts));
  }
}

export function title(
  title: Message,
  subtitle: Message,
  opts: LoggerOpts = {}
) {
  let str = chalk.bold(title);
  if (subtitle) str += ' ' + chalk.dim(subtitle);
  write(str, opts);
}

const INFO_PREFIX = chalk.cyan('info');
const WARN_PREFIX = chalk.yellow('warn');
const ERROR_PREFIX = chalk.red('error');
const SUCCESS_PREFIX = chalk.green('success');

export function info(message: Message, opts: LoggerOpts = {}) {
  write(message, { prefix: INFO_PREFIX, ...opts }, true);
}

export function warn(message: Message, opts: LoggerOpts = {}) {
  write(message, { prefix: WARN_PREFIX, ...opts }, true);
}

export function error(message: Message, opts: LoggerOpts = {}) {
  write(message, { prefix: ERROR_PREFIX, ...opts }, true);
}

export function success(message: Message, opts: LoggerOpts = {}) {
  write(message, { prefix: SUCCESS_PREFIX, ...opts }, true);
}

export function stdout(
  cmd: string,
  data: Buffer,
  pkg?: Package,
  opts: LoggerOpts = {}
) {
  let prefix = chalk.cyan(prompt(pkg, cmd));
  write(data, { prefix, ...opts }, false);
}

export function stderr(
  cmd: string,
  data: Buffer,
  pkg?: Package,
  opts: LoggerOpts = {}
) {
  let prefix = chalk.red(prompt(pkg, cmd));
  write(data, { prefix, ...opts }, true);
}

export function cmd(cmd: string, args: Array<string>, opts: LoggerOpts = {}) {
  let msg = chalk.dim(prompt(null, cmd));
  if (args.length) {
    msg += ' ';
    msg += chalk.magenta(args.join(' '));
  }
  write(msg, {}, true);
}
