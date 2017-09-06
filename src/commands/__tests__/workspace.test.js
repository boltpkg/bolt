// @flow
import {workspace, toWorkspaceOptions} from '../workspace';

test('pyarn workspace', async () => {
  await workspace(toWorkspaceOptions(['run', 'foo'], {}));
});
