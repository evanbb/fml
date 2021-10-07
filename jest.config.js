const { join } = require('path');
const cwd = process.cwd();

module.exports = {
  rootDir: cwd,
  // moduleNameMapper: {
  //   '@fml/([^/]*)/?(.*)':
  //     '<rootDir>/../../node_modules/@fml/$1/lib/$2/index.cjs.js',
  // },
  transform: {
    '\\.[jt]sx?$': [
      'babel-jest',
      {
        configFile: join(cwd, '.babelrc'),
      },
    ],
  },
};
