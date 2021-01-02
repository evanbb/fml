import fs from 'fs'
import typescript from '@rollup/plugin-typescript'

export default fs.readdirSync('packages').map(dir => ({
  input: `packages/${dir}/src/index.ts`,
  output: {
    dir: `packages/${dir}/lib`
  },
  plugins: [
    typescript(),
    {
      name: 'rollup-plugin-copy-types',
      async writeBundle() {
        if (fs.existsSync(`packages/${dir}/src/types.ts`)) {
          fs.copyFileSync(`packages/${dir}/src/types.ts`, `packages/${dir}/index.d.ts`)
        }
      }
    }
  ]
}))
