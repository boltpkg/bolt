const actualSpawn = require.requireActual('../npm');
const npm = jest.genMockFromModule('../npm');

let mockInfoResponses = [];

npm.info = async function(pkgName) {
  return Promise.resolve({
    name: pkgName,
    version: '1.0.0'
  });
};

npm.infoAllow404 = function(pkgName) {
  let mockResponse = mockInfoResponses.find(mock => mock.pkgName === pkgName);

  if (mockResponse) return Promise.resolve(mockResponse.mockResponse);

  return Promise.resolve({
    published: true,
    pkgInfo: {
      name: pkgName,
      version: '1.0.0'
    }
  });
};

/** Causes npm.infoAllow404 to return a specified mock response for a packageName */
npm.__mockInfoAllow404 = (pkgName, mockResponse) => {
  mockInfoResponses.push({ pkgName, mockResponse });
};

npm.__clearMockInfoAllow404 = () => {
  mockInfoResponses = [];
};

module.exports = npm;
