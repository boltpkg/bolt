const spawn = jest.genMockFromModule('../src/utils/spawn');

let response;

spawn.default = async function mockSpawn() {
  return Promise.resolve()
};

spawn.__setSpawnResponse = () => {

};

module.exports = spawn;
