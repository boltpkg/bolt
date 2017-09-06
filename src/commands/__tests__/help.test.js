// @flow
import {help, toHelpOptions} from '../help';

jest.unmock('../help');

test('pyarn help', async () => {
  await help(toHelpOptions([], {}));
});
