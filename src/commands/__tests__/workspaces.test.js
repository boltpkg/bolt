// @flow
import {workspaces, toWorkspacesOptions} from '../workspaces';

jest.unmock('../workspaces');

test('pyarn workspaces', async () => {
  await workspaces(toWorkspacesOptions(['run', 'foo'], {}));
});
