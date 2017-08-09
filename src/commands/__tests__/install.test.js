// @flow
import install from '../install';

jest.unmock('../install');
// jest.unmock('../../Package');

test('pyarn install', async () => {
  await install([], {});
});
