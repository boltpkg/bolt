// @flow
import workspace from '../workspace';

jest.unmock('../workspace');

test('pyarn workspace', async () => {
  await workspace(['run', 'foo'], {});
});
