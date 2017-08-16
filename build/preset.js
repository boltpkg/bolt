module.exports = {
  presets: [
    'flow',
    ['env', {
      loose: true,
      targets: {
        node: process.env.BUILD === 'legacy' ? 4 : 8
      }
    }]
  ],
  plugins: [
    'transform-class-properties',
    'transform-object-rest-spread',
    'transform-runtime'
  ],
};
