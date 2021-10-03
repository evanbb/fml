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

['validators'].forEach((dir) =>
  fs
    .readdirSync(`packages/add/src/${dir}`)
    .forEach(
      (file) =>
        (entries[
          `@fml/add/${dir}/${path.parse(file).name}`
        ] = `packages/add/src/${dir}/${file}`),
    ),
);

['controls', 'layouts'].forEach((dir) =>
  fs
    .readdirSync(`packages/react/src/${dir}`)
    .filter((name) => !name.includes('stories'))
    .forEach(
      (file) =>
        (entries[
          `@fml/react/${dir}/${path.parse(file).name}`
        ] = `packages/react/src/${dir}/${file}`),
    ),
);

function generateChunkName(chunkInfo) {
  // we really only care about what package the chunk is part of
  // as chunks will only contain modules within the same package

  const moduleIdOfSomeModuleInThisChunk = Object.keys(chunkInfo.modules)[0];
  const { dir } = path.parse(moduleIdOfSomeModuleInThisChunk);
  const packagesDir = path.join(__dirname, 'packages');
  const packageNameForThisChunk = path
    .relative(packagesDir, dir)
    .split(path.sep)
    .shift();

  return `${packageNameForThisChunk}/lib/${chunkInfo.name}.[format].[hash].js`;
}

function generateEntryName(chunkInfo) {
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
      entryFileNames: generateEntryName,
      chunkFileNames: generateChunkName,
      format: 'es',
    },
    {
      dir: `packages`,
      entryFileNames: generateEntryName,
      chunkFileNames: generateChunkName,
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
