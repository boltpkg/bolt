// @flow
import inquirer from 'inquirer';
import * as messages from './messages';

const prompt = inquirer.createPromptModule();
const KEY = 'value';

type Choice<Value> = { name: messages.Message, value: Value };
type Choices<Value> = Array<Choice<Value> | Separator>;
export opaque type Separator = Object;

export function separator(): Separator {
  return new inquirer.Separator();
}

export async function list<Value: string>(
  message: messages.Message,
  choices: Choices<Value>,
  opts: { default?: Value } = {}
): Promise<Value> {
  let answers = await prompt([
    {
      type: 'list',
      name: KEY,
      message,
      choices,
      default: opts.default
    }
  ]);
  return answers[KEY];
}

export async function input(message: messages.Message): Promise<string> {
  let answers = await prompt([
    {
      type: 'input',
      name: KEY,
      message
    }
  ]);
  return answers[KEY];
}

export async function password(message: messages.Message): Promise<string> {
  let answers = await prompt([
    {
      type: 'password',
      name: KEY,
      message
    }
  ]);
  return answers[KEY];
}

export async function editor(message: messages.Message): Promise<string> {
  let answers = await prompt([
    {
      type: 'editor',
      name: KEY,
      message
    }
  ]);
  return answers[KEY];
}
