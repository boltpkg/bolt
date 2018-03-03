// @flow
import { licensesGenerateDisclaimer } from '../generateDisclaimer';
import * as yarn from '../../../utils/yarn';

jest.mock('../../../utils/yarn');

describe('bolt licenses generate-disclaimer', () => {
  it('calls yarn licenses with generate-disclaimer script', async () => {
    await licensesGenerateDisclaimer({ cwd: 'dummyPattern/dummyPath' }, []);

    expect(
      yarn.cliCommand
    ).toHaveBeenCalledWith('dummyPattern/dummyPath', 'licenses', [
      'generate-disclaimer'
    ]);
  });
});
