// @flow
import * as prompts from '../prompts';
import inquirer from 'inquirer';

jest.mock('inquirer');

describe('Prompts', () => {
  test('isWorkspaceNeeded', async () => {
    inquirer.prompt.mockReturnValueOnce({ workspaces: true });
    let workspaceNeeded = await prompts.isWorkspaceNeeded();
    expect(workspaceNeeded).toBe(true);
  });
});
