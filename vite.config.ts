import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  // Archivo central en tu computador donde se guardará todo automáticamente
  const dbPath = path.resolve(__dirname, 'datos_fundo.json');

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'api-persistencia-automatica',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === '/api/datos') {
              // 1. Cuando un navegador entra, le entregamos los datos guardados en el disco
              if (req.method === 'GET') {
                res.setHeader('Content-Type', 'application/json');
                if (fs.existsSync(dbPath)) {
                  try {
                    const content = fs.readFileSync(dbPath, 'utf-8');
                    res.statusCode = 200;
                    res.end(content);
                    return;
                  } catch (e) {
                    console.error('Error leyendo archivo de datos:', e);
                  }
                }
                res.statusCode = 200;
                res.end(JSON.stringify({}));
                return;
              }

              // 2. Cuando agregas o borras algo, se guarda aquí de inmediato
              if (req.method === 'POST') {
                let body = '';
                req.on('data', chunk => {
                  body += chunk;
                });
                req.on('end', () => {
                  try {
                    JSON.parse(body); // Valida que la información esté correcta
                    fs.writeFileSync(dbPath, body, 'utf-8');
                    res.setHeader('Content-Type', 'application/json');
                    res.statusCode = 200;
                    res.end(JSON.stringify({ guardado: true }));
                  } catch (err) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: 'Datos no válidos' }));
                  }
                });
                return;
              }
            }
            next();
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});