import fs from 'fs'
import typescript from '@rollup/plugin-typescript'

export default fs.readdirSync('packages').map(dir => ({
  input: `packages/${dir}/src/index.ts`,
  output: {
    dir: `packages/${dir}/lib`
  },
  plugins: [typescript()]
}))
