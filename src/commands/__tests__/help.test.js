// @flow
import help from '../help';

jest.unmock('../help');

test('pyarn help', async () => {
  await help([], {});
});
