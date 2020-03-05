// @flow
import { publish, toPublishOptions } from '../publish';
import fixtures from 'fixturez';
import * as logger from '../../utils/logger';
import * as publishUtils from '../../utils/publish';

const f = fixtures(__dirname);

jest.mock('../../utils/logger');
jest.mock('../../utils/publish');

const unsafePublishUtil: any & typeof publishUtils.publish =
  publishUtils.publish;

describe('bolt publish', () => {
  beforeEach(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should successfully publish packages', async () => {
    let cwd = f.find('simple-project');
    unsafePublishUtil.mockReturnValue([
      {
        published: true,
        name: 'example-package-01',
        version: '1.0.0'
      },
      {
        published: true,
        name: 'example-package-02',
        version: '1.0.0'
      },
      {
        published: true,
        name: 'example-package-03',
        version: '1.0.0'
      }
    ]);

    await publish({ cwd });
    expect(unsafePublishUtil).toHaveBeenCalledTimes(1);
  });

  test('should throw if publishing failed > 1 time', async () => {
    let cwd = f.find('simple-project');
    unsafePublishUtil.mockReturnValue([
      {
        published: true,
        name: 'example-package-01',
        version: '1.0.0'
      },
      {
        published: false,
        name: 'example-package-02',
        version: '1.0.0'
      }
    ]);

    await expect(publish({ cwd })).rejects.toBeInstanceOf(Error);
    expect(unsafePublishUtil).toHaveBeenCalledTimes(1);
  });

  test('should log successful and unsuccessful packages', async () => {
    let cwd = f.find('simple-project');
    unsafePublishUtil.mockReturnValue([
      {
        published: true,
        name: 'example-package-01',
        version: '1.0.0'
      },
      {
        published: false,
        name: 'example-package-02',
        version: '1.0.0'
      },
      {
        published: true,
        name: 'example-package-03',
        version: '1.0.0'
      },
      {
        published: true,
        name: 'example-package-04',
        version: '1.0.0'
      },
      {
        published: false,
        name: 'example-package-05',
        version: '1.0.0'
      }
    ]);

    await expect(publish({ cwd })).rejects.toBeInstanceOf(Error);
    expect(unsafePublishUtil).toHaveBeenCalledTimes(1);
    expect(logger.success).toHaveBeenCalledTimes(3);
    expect(logger.error).toHaveBeenCalledTimes(2);
  });
});
