// @flow
import workspaces from '../workspaces';

jest.unmock('../workspaces');

test('pyarn workspaces', async () => {
  await workspaces(['run', 'foo'], {});
});
