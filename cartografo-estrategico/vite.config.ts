import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';
import JSZip from 'jszip';

function downloadZipPlugin(): Plugin {
  return {
    name: 'download-zip-middleware',
    configureServer(server) {
      server.middlewares.use('/api/download-zip', async (req, res) => {
        try {
          const zip = new JSZip();
          const rootDir = process.cwd();

          const addFilesRecursively = (dir: string, baseInZip = '') => {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
              const name = entry.name;
              // Skip ignored directories & files
              if (
                name === 'node_modules' ||
                name === '.git' ||
                name === 'dist' ||
                name === '.aistudio' ||
                name === 'bun.lock' ||
                name.endsWith('.log')
              ) {
                continue;
              }

              const fullPath = path.join(dir, name);
              const zipPath = baseInZip ? `${baseInZip}/${name}` : name;

              if (entry.isDirectory()) {
                addFilesRecursively(fullPath, zipPath);
              } else if (entry.isFile()) {
                const fileData = fs.readFileSync(fullPath);
                zip.file(zipPath, fileData);
              }
            }
          };

          addFilesRecursively(rootDir);

          const content = await zip.generateAsync({
            type: 'nodebuffer',
            compression: 'DEFLATE',
            compressionOptions: { level: 6 },
          });

          res.setHeader('Content-Type', 'application/zip');
          res.setHeader(
            'Content-Disposition',
            'attachment; filename="cartografo-estrategico.zip"'
          );
          res.setHeader('Content-Length', content.length);
          res.end(content);
        } catch (err: any) {
          console.error('Error generating zip download:', err);
          res.statusCode = 500;
          res.end('Error generating project ZIP');
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), downloadZipPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
