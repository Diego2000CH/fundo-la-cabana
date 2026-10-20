import express, { Request, Response } from 'express';
import path from 'path';

const app = express();
const port = process.env.PORT || 10000;

// Permitir recibir datos grandes en formato JSON
app.use(express.json({ limit: '50mb' }));

// BASE DE DATOS CENTRAL DEL FUNDO EN EL SERVIDOR
let baseDatosFundo: any = null;

// 1. ENDPOINT PARA LEER DATOS (Cualquier celular o PC pide la información aquí)
app.get('/api/datos', (_req: Request, res: Response) => {
  res.json(baseDatosFundo || {});
});

// 2. ENDPOINT PARA GUARDAR DATOS (Cualquier cambio se guarda aquí para todos)
app.post('/api/datos', (req: Request, res: Response) => {
  baseDatosFundo = req.body;
  res.json({ ok: true, mensaje: 'Guardado centralmente con éxito' });
});

// Servir la aplicación web compilada
const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));

app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor Fundo La Cabaña activo en el puerto ${port}`);
});
