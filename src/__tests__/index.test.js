import * as functions from '../index';

/** Sanity check to make sure we don't break the public functions API */

describe('public functions API', () => {
  it('should expose the expected methods', () => {
    const expectedFunctions = [
      'getWorkspaces',
      'getDependencyGraph',
      'getDependentsGraph',
      'runWorkspaceTasks',
      'updatePackageVersions'
    ];

    expectedFunctions.forEach(func => {
      expect(functions[func]).toBeInstanceOf(Function);
    });

    // The + 1 is for the __esModule key
    expect(Object.keys(functions).length).toEqual(expectedFunctions.length + 1);
  });
});
