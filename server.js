// --- Dependencias ---
import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

// --- Configuración de rutas y entorno ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Archivos JSON locales
const ARCHIVO_CANCIONES = path.join(__dirname, "canciones.json");
const ARCHIVO_NUEVAS = path.join(__dirname, "canciones-nuevas.json");

// Crear app de Express
const app = express();

// Middleware
app.use(cors()); // permite peticiones desde tu frontend (Vercel)
app.use(express.json());

// --- Funciones auxiliares ---
function leerArchivo(ruta) {
  try {
    const contenido = fs.readFileSync(ruta, "utf-8");
    return JSON.parse(contenido);
  } catch (error) {
    console.error(`❌ Error al leer ${ruta}:`, error);
    return [];
  }
}

// --- Rutas API ---
app.get('/api/canciones', (req, res) => {
  const canciones = leerArchivo(ARCHIVO_CANCIONES);
  res.json(canciones);
});

app.get('/api/nuevas', (req, res) => {
  const nuevas = leerArchivo(ARCHIVO_NUEVAS);
  res.json(nuevas);
});

app.post('/api/nuevas', (req, res) => {
  try {
    const nuevas = leerArchivo(ARCHIVO_NUEVAS);
    nuevas.push(req.body);
    fs.writeFileSync(ARCHIVO_NUEVAS, JSON.stringify(nuevas, null, 2));
    res.json({ ok: true });
  } catch (error) {
    console.error("❌ Error al guardar en canciones-nuevas.json:", error);
    res.status(500).json({ ok: false, error: "Error al guardar" });
  }
});

app.post('/api/canciones', (req, res) => {
  try {
    const canciones = leerArchivo(ARCHIVO_CANCIONES);
    canciones.push(req.body);
    fs.writeFileSync(ARCHIVO_CANCIONES, JSON.stringify(canciones, null, 2));
    res.json({ ok: true });
  } catch (error) {
    console.error("❌ Error al guardar en canciones.json:", error);
    res.status(500).json({ ok: false, error: "Error al guardar" });
  }
});

// --- Puerto ---
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en puerto ${PORT}`);
});
