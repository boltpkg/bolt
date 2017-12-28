// @flow
import Project from './Project';
import Workspace from './Workspace';
import semver from 'semver';
import * as logger from './utils/logger';
import * as messages from './utils/messages';

export type SourceDepGraph = Map<
  Workspace,
  {
    dependencies: Set<Workspace>,
    dependents: Set<Workspace>
  }
>;

export default class DependencyGraph {
  _workspaces: Map<
    Workspace,
    {
      dependencies: Set<Workspace>,
      dependents: Set<Workspace>
    }
  >;
  _workspacesByName: { [key: string]: Workspace };
  _isValid: boolean;

  constructor(project: Project, workspaces: Array<Workspace>) {
    this._workspaces = new Map();
    this._isValid = true;
    this._workspacesByName = {};

    for (let workspace of workspaces) {
      this._workspacesByName[workspace.pkg.config.getName()] = workspace;
      this._workspaces.set(workspace, {
        dependencies: new Set(),
        dependents: new Set()
      });
    }

    for (let workspace of workspaces) {
      let allDependencies = workspace.pkg.getAllDependencies();

      for (let [depName, depVersion] of allDependencies) {
        let match = this._workspacesByName[depName];
        if (!match) continue;

        let actual = depVersion;
        let expected = match.pkg.config.getVersion();

        if (!semver.satisfies(expected, depVersion)) {
          this._isValid = false;
          logger.error(
            messages.packageMustDependOnCurrentVersion(
              workspace.pkg.config.getName(),
              depName,
              expected,
              depVersion
            )
          );
          continue;
        }

        let wNode = this._workspaces.get(workspace);
        let mNode = this._workspaces.get(match);

        if (wNode) wNode.dependencies.add(match);
        if (mNode) mNode.dependents.add(workspace);
      }
    }
  }

  getDepsByWorkspace(workspace: Workspace) {
    return this._workspaces.get(workspace);
  }

  getWorkspaceByName(pkgName: string) {
    return this._workspacesByName[pkgName];
  }

  getDepsByName(pkgName: string) {
    return this.getDepsByWorkspace(this.getWorkspaceByName(pkgName));
  }

  has(pkgName: string) {
    return !!this.getWorkspaceByName(pkgName);
  }

  isValid() {
    return this._isValid;
  }

  entries() {
    return this._workspaces.entries();
  }
}
