// @flow
import { licensesList } from '../list';
import * as yarn from '../../../utils/yarn';

jest.mock('../../../utils/yarn');

describe('bolt licenses list', () => {
  it('calls yarn licenses with list script', async () => {
    await licensesList({
      flags: { cwd: 'dummyPattern/dummyPath' },
      subCommandArgs: []
    });
    expect(
      yarn.cliCommand
    ).toHaveBeenCalledWith('dummyPattern/dummyPath', 'licenses', ['list']);
  });
});
