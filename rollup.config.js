import fs from 'fs';
import path from 'path';
import babel from '@rollup/plugin-babel';
import eslint from '@rollup/plugin-eslint';
import resolve from '@rollup/plugin-node-resolve';

const packageDirs = fs
  .readdirSync('packages')
  .filter((pkg) => fs.existsSync(path.join('packages', pkg, 'package.json')))
  .map((pkg) => `packages/${pkg}`);

const entries = packageDirs.reduce((acc, pkg) => {
  const pkgJson = JSON.parse(
    fs.readFileSync(path.join(pkg, 'package.json'), 'utf-8'),
  );
  const { name } = pkgJson;
  const entry = `${pkg}/src/index.ts`;

  return {
    ...acc,
    [name]: entry,
  };
}, {});

entries['@fml/core/controls'] = 'packages/core/src/controls/index.ts';
entries['@fml/core/controls/add/checkbox'] =
  'packages/core/src/controls/add/checkbox.ts';
entries['@fml/core/controls/add/date'] =
  'packages/core/src/controls/add/date.ts';
entries['@fml/core/controls/add/datetime'] =
  'packages/core/src/controls/add/datetime.ts';
entries['@fml/core/controls/add/hidden/foobar'] =
  'packages/core/src/controls/add/hidden.ts';
entries['@fml/core/controls/add/number'] =
  'packages/core/src/controls/add/number.ts';
entries['@fml/core/controls/add/radios'] =
  'packages/core/src/controls/add/radios.ts';
entries['@fml/core/controls/add/select'] =
  'packages/core/src/controls/add/select.ts';
entries['@fml/core/controls/add/text'] =
  'packages/core/src/controls/add/text.ts';
entries['@fml/core/controls/add/textarea'] =
  'packages/core/src/controls/add/textarea.ts';
entries['@fml/core/controls/add/toggle'] =
  'packages/core/src/controls/add/toggle.ts';
entries['@fml/core/layouts'] = 'packages/core/src/layouts/index.ts';
entries['@fml/core/validators'] = 'packages/core/src/validators/index.ts';

function generateEntryChunkName(chunkInfo) {
  const entryName = chunkInfo.name.replace('@fml/', '');

  const slashIndex = entryName.indexOf('/');
  const packageName = entryName.substring(
    0,
    slashIndex !== -1 ? slashIndex : undefined,
  );

  const result = `${packageName}/lib${
    slashIndex !== -1 ? entryName.substring(slashIndex) : ''
  }/index.[format].js`;

  return result;
}

export default {
  input: entries,
  external: (mid) => /^@fml\//gi.test(mid),
  output: [
    {
      dir: `packages`,
      entryFileNames: generateEntryChunkName,
      format: 'es',
    },
    {
      dir: `packages`,
      entryFileNames: generateEntryChunkName,
      format: 'cjs',
    },
  ],
  plugins: [
    eslint(),
    resolve({
      extensions: ['.ts', '.tsx'],
      resolveOnly: ['packages/core/src', 'packages/react/src'],
    }),
    babel({
      extensions: ['.ts', '.tsx'],
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: 'current',
            },
          },
        ],
        ['@babel/preset-typescript'],
        [
          '@babel/preset-react',
          {
            runtime: 'automatic',
          },
        ],
      ],
    }),
  ],
};
