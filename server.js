import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

// paths absolutos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// JSON
const cancionesPath = path.join(__dirname, "canciones.json");
const nuevasPath = path.join(__dirname, "canciones-nuevas.json");

// leer canciones
app.get("/api/canciones", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(cancionesPath, "utf-8"));
    res.json(data);
  } catch (error) {
    console.error("Error leyendo canciones.json:", error);
    res.status(500).json({ error: "Error al leer canciones" });
  }
});

// leer canciones nuevas
app.get("/api/nuevas", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(nuevasPath, "utf-8"));
    res.json(data);
  } catch (error) {
    console.error("Error leyendo canciones-nuevas.json:", error);
    res.status(500).json({ error: "Error al leer nuevas canciones" });
  }
});

// comprobacion de servidor
app.get("/", (req, res) => {
  res.send("Servidor OTGW funcionando correctamente ✅");
});

// puerto dinamico para koyeb
const PORT = process.env.PORT || 3000;
// ping para despertar el servidor
app.get("/ping", (req, res) => {
  console.log("Ping recibido ✅"); // se verá en los logs de Render
  res.json({ status: "awake" });
});

app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
