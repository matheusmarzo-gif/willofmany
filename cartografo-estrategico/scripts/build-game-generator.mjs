import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';

await build({
  entryPoints: [fileURLToPath(new URL('../gameMapExport.ts', import.meta.url))],
  outfile: fileURLToPath(new URL('../../random-map-generator.js', import.meta.url)),
  bundle: true,
  format: 'iife',
  globalName: 'WillOfManyMapGenerator',
  target: ['es2020'],
  footer: {
    js: 'if (typeof module !== "undefined" && module.exports) module.exports = WillOfManyMapGenerator;',
  },
});
