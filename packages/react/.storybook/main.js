const { join } = require('path');
const cwd = process.cwd();

module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-essentials'],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    config.resolve.alias = {
      ...config.resolve.alias,
      '@fml/add': join(cwd, '..', '..', 'node_modules', '@fml', 'add', 'lib'),
      '@fml/core': join(cwd, '..', '..', 'node_modules', '@fml', 'core', 'lib'),
      '@fml/react': join(cwd, '..', '..', 'node_modules', '@fml', 'react', 'lib'),
    };

    // Return the altered config
    return config;
  },
};
