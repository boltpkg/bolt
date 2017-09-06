// @flow
import {workspace, toWorkspaceOptions} from '../workspace';

jest.unmock('../workspace');

test('pyarn workspace', async () => {
  await workspace(toWorkspaceOptions(['run', 'foo'], {}));
});
