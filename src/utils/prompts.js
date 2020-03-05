// @flow

import inquirer from 'inquirer';

export async function isWorkspaceNeeded() {
  let question = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'workspaces',
      message: 'create workspaces?',
      default: false,
      prefix: 'question'
    }
  ]);

  return question.workspaces;
}
