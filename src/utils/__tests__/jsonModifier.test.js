// @flow
import addWorkspacesToJson from '../jsonModifier';

describe('Json Modifier', () => {
  test('addWorkspacesToJson()', async () => {
    const json = await addWorkspacesToJson({});
    expect(JSON.stringify(json)).toBe('{"bolt":{"workspaces":["packages/*"]}}');
  });

  test('addWorkspacesToJson() appends workspace information correctly', async () => {
    const json = await addWorkspacesToJson({ name: 'simple-project' });
    expect(JSON.stringify(json)).toBe(
      `{"name":"simple-project","bolt":{"workspaces":["packages/*"]}}`
    );
  });
});
