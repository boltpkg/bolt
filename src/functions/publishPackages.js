// @flow
import { publish, type PublishOptions } from '../utils/publish';

export default async function publishPackages(opts: PublishOptions) {
  return publish(opts);
}
