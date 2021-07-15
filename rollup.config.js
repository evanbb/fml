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

function generateEntryChunkName(chunkInfo) {
  const packageName = chunkInfo.name.replace('@fml/', '');
  return `${packageName}/lib/index.[format].js`;
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
