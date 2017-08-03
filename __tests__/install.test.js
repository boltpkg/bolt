jest.mock('../src/utils/spawn');

test('foo', () => {
  console.log(require('../src/utils/spawn'));



  jest.spyOn(module, 'exportName').mockImplementation(() => {

  });
});
