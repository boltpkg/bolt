// @flow
import install from '../install';
import * as processes from '../../utils/processes';

jest.mock('../../utils/processes');
jest.unmock('../install');

test('pyarn install', async () => {
  await install([], {});

  console.log(processes.spawn.mock.calls);
});
