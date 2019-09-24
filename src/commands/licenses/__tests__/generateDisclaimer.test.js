// @flow
import {
  licensesGenerateDisclaimer,
  toLicensesGenerateDisclaimerOptions
} from '../generateDisclaimer';
import * as yarn from '../../../utils/yarn';

jest.mock('../../../utils/yarn');

describe('bolt licenses generate-disclaimer', () => {
  it('calls yarn licenses with generate-disclaimer script', async () => {
    await licensesGenerateDisclaimer(
      toLicensesGenerateDisclaimerOptions([], { cwd: 'dummyPattern/dummyPath' })
    );

    expect(yarn.cliCommand).toHaveBeenCalledWith(
      'dummyPattern/dummyPath',
      'licenses',
      ['generate-disclaimer']
    );
  });
});
