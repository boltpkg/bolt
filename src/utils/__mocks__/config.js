const actualConfig = require.requireActual('../config');
const config = jest.genMockFromModule('../config');

let mockConfigReads = [];

config.readConfigFile = configPath => {
  const mockRead = mockConfigReads.find(mock => mock.configPath === configPath);
  if (mockRead) {
    return Promise.resolve(mockRead.mockResult);
  }

  return actualConfig.readConfigFile(configPath);
};

config.getProjectConfig = actualConfig.getProjectConfig;

// __mockRead('path/to/config', { name: '', version: ''})
// to mock a specific read (otherwise will return the actual value)
config.__mockRead = (configPath, mockResult) => {
  mockConfigReads.push({ configPath, mockResult });
};

config.__unmockRead = configPath => {
  mockConfigReads = mockConfigReads.filter(
    mock => mock.configPath === configPath
  );
};

module.exports = config;
