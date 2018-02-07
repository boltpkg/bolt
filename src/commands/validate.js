// @flow
import Project from '../Project';
import * as options from '../utils/options';
import validateProject from '../utils/validateProject';
import * as logger from '../utils/logger';
import * as messages from '../utils/messages';

export type ValidateType = {
  cwd?: string
};

export function toValidateOptions(
  args: options.Args,
  flags: options.Flags
): ValidateType {
  return {
    cwd: options.string(flags.cwd, 'cwd')
  };
}

export async function validate(opts: ValidateType) {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);

  let validationResult = await validateProject(project);

  if (!validationResult.projectIsValid) {
    validationResult.invalidMessages.forEach(message => {
      logger.error(message);
    });
  } else {
    logger.success(messages.projectIsValid(project.pkg.config.getName()));
  }
}
