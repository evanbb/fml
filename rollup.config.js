import fs from 'fs'
import typescript from 'rollup-plugin-ts'
import eslint from '@rollup/plugin-eslint'

export default fs.readdirSync('packages').map(dir => ({
  input: `packages/${dir}/src/index.ts`,
  external: mid => /^@fml\//gi.test(mid),
  output: [
    {
      dir: `packages/${dir}/lib`,
      entryFileNames: '[name].es.js',
      format: 'es'
    },
    {
      dir: `packages/${dir}/lib`,
      entryFileNames: '[name].cjs.js',
      format: 'cjs'
    }
  ],
  plugins: [
    eslint(),
    typescript()
  ]
}))
