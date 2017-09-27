/* @flow */

import path from 'path';
import Project from '../Project';

export default async function getProject(dir: string) {
  const project = await Project.init(dir);
  return {
    dir: project.pkg.dir,
    name: project.pkg.config.getName(),
    config: project.pkg.config.json
  };
}
