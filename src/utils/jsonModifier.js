// @flow
import type { JSONValue } from '../types';

export default async function addWorkspacesToJson(json: {
  [key: string]: JSONValue
}) {
  const workspaces = ['packages/*'];
  json.bolt = {
    workspaces
  };
  return json;
}
