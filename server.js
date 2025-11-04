import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

// 📍 Paths absolutos correctos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Los JSON están directamente en la raíz
const cancionesPath = path.join(__dirname, "canciones.json");
const nuevasPath = path.join(__dirname, "canciones-nuevas.json");

// 🎵 Endpoint de canciones
app.get("/api/canciones", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(cancionesPath, "utf-8"));
    res.json(data);
  } catch (error) {
    console.error("Error leyendo canciones.json:", error);
    res.status(500).json({ error: "Error al leer canciones" });
  }
});

// 🎶 Endpoint de nuevas canciones
app.get("/api/nuevas", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(nuevasPath, "utf-8"));
    res.json(data);
  } catch (error) {
    console.error("Error leyendo canciones-nuevas.json:", error);
    res.status(500).json({ error: "Error al leer nuevas canciones" });
  }
});

// Ruta base opcional para probar que el servidor responde
app.get("/", (req, res) => {
  res.send("Servidor OTGW funcionando correctamente ✅");
});

// 🔥 Puerto dinámico (Koyeb asigna su propio)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
