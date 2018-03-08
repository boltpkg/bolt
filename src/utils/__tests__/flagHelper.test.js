// @flow

import * as flagHelpers from '../flagHelper';

test('getting args, boolean flags and script flags', () => {
  const {
    additionalArgs,
    scriptFlags,
    updatedFlags
  } = flagHelpers.getArgsBooleanFlagsScriptFlags({
    '--': [],
    dev: 'react',
    coverage: true,
    camelCaseFlag: 'flagValue'
  });

  expect(additionalArgs).toEqual(['react']);

  expect(scriptFlags).toEqual([
    '',
    '--dev',
    '--coverage',
    '--camel-case-flag flagValue'
  ]);

  expect(updatedFlags).toEqual({
    '--': [],
    camelCaseFlag: 'flagValue',
    coverage: true,
    dev: true
  });
});
