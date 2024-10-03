const esbuild = require('esbuild');
const esbuildPluginTsc = require('esbuild-plugin-tsc');
const pkg = require('./package.json');

esbuild
  .build({
    entryPoints: ['src/cli/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'node20',
    outfile: 'dist/cli.min.js',
    external: [...Object.keys(pkg.dependencies || {})],
    plugins: [
      esbuildPluginTsc({
        tsconfigPath: './tsconfig.json'
      })
    ],
    minify: true,
    sourcemap: false
  })
  .catch(() => process.exit(1));
