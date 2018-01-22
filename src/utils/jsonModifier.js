export default async function addWorkspacesToJson(json: JSONValue) {
  const workspaces = ['packages/*'];
  json.bolt = {
    workspaces
  };
  return json;
}
