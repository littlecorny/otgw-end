import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname (__filename);

const ARCHIVO_CANCIONES = path.join (__dirname, "canciones.json");
const ARCHIVO_NUEVAS = path.join(__dirname, "canciones-nuevas.json");

//crear app express
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));


////


// LEER CANCIONES.JSON
function leerCanciones () {
    try {
        const contenido = fs.readFileSync(ARCHIVO_CANCIONES, "utf-8");
        const canciones = JSON.parse(contenido);
        console.log(`Se leyeron ${canciones.length} canciones`);
        return canciones;

    }  catch (error) {
        console.error("Error al leer el archivo de canciones:", error);
        return [];  
    }
}

// LEER NUEVAS-CANCIONES.JSON

function leerArchivo(ruta) {
  try {
    const contenido = fs.readFileSync(ruta, "utf-8");
    return JSON.parse(contenido);
  } catch (error) {
    console.error(`Error al leer ${ruta}:`, error);
    return [];
  }
}


const PORT = 3000;

app.get('/', (peticion, respuesta) => {
    respuesta.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/api/canciones', (peticion, respuesta) => {
    console.log('Solicitud: Dame todas las canciones');
    const canciones = leerCanciones();
    respuesta.json(canciones);
});


// Obtener canciones nuevas (para el dropdown o formulario)
app.get('/api/nuevas', (req, res) => {
  try {
    const nuevas = leerArchivo(ARCHIVO_NUEVAS);
    res.json(nuevas);
  } catch (error) {
    console.error("Error al leer canciones nuevas:", error);
    res.status(500).json({ ok: false, error: "No se pudieron leer las canciones nuevas" });
  }
});


app.post('/api/nuevas', (peticion, respuesta) => {
  try {
    const nuevas = leerArchivo(ARCHIVO_NUEVAS);
    nuevas.push(peticion.body);
    fs.writeFileSync(ARCHIVO_NUEVAS, JSON.stringify(nuevas, null, 2));
    respuesta.json({ ok: true });
  } catch (error) {
    console.error("Error al guardar canción:", error);
    respuesta.status(500).json({ ok: false, error: "Error al guardar" });
  }
});

// 🟢 NUEVO: guardar canción añadida permanentemente en canciones.json
app.post('/api/canciones', (req, res) => {
  try {
    const canciones = leerArchivo(ARCHIVO_CANCIONES);
    canciones.push(req.body);
    fs.writeFileSync(ARCHIVO_CANCIONES, JSON.stringify(canciones, null, 2));
    res.json({ ok: true });
  } catch (error) {
    console.error("❌ Error al guardar la canción en canciones.json:", error);
    res.status(500).json({ ok: false, error: "No se pudo guardar en canciones.json" });
  }
});


app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
 });
