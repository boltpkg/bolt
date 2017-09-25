// @flow
import chalk from 'chalk';
import type Package from '../Package';

export function prefix(prefix: string, message: string | Buffer) {
  return message
    .toString()
    .trimRight()
    .split('\n')
    .map(line => {
      return prefix + ' ' + line;
    })
    .join('\n');
}

export function log(message: string) {
  console.log(message);
}

export function title(message: string) {
  console.log(chalk.bold(message));
}

export function info(message: string) {
  console.error(prefix(chalk.cyan('info'), message));
}

export function warn(message: string) {
  console.error(prefix(chalk.yellow('warn'), message));
}

export function error(message: string) {
  console.error(prefix(chalk.red('error'), message));
}

export function success(message: string) {
  console.log(prefix(chalk.green('success'), message));
}

function prompt(pkg) {
  return (pkg ? '(' + pkg.config.name + ') ' : '') + '$ ';
}

export function stdout(cmd: string, data: Buffer, pkg?: Package) {
  console.log(prefix(chalk.cyan(prompt(pkg) + cmd), data));
}

export function stderr(cmd: string, data: Buffer, pkg?: Package) {
  console.error(prefix(chalk.red(prompt(pkg) + cmd), data));
}
