const express = require("express");
const dotenv = require("dotenv");
const app = express();
const port = process.env.PORT ?? 3080;
const connectDB = require("./database/database.js");
const Computer = require("./database/product.js");

// Cargar variables de entorno
dotenv.config();

// Conexión a la base de datos MongoDB
connectDB();

app.use(express.json());

// Ruta principal de la API
app.get("/", (req, res) => {
  res.json("¡Bienvenido a la API de productos de Juan Diego Gonzalez Antoniazzi correspondiente al TP Integrador de la Diplomatura en Backend de la UNTREF!");
});

// Obtener todos los productos (con filtros opcionales)
app.get("/productos", async (req, res) => {
  const { categoria, nombre } = req.query;

  // Construir el filtro de búsqueda
  let filtro = {};
  if (categoria) {
    filtro.categoria = { $regex: `^${categoria.slice(0, 3)}`, $options: "i" };
  }
  if (nombre) {
    filtro.nombre = { $regex: nombre, $options: "i" };
  }

  try {
    const productos = await Computer.find(filtro);
    if ((categoria || nombre) && productos.length === 0) {
      return res.status(404).send("No se encontraron productos con los criterios especificados.");
    }
    res.json(productos);
  } catch (error) {
    console.error("Error al buscar productos:", error);
    res.status(500).send("Error interno del servidor al obtener los productos.");
  }
});

// Actualizar un producto por su ID
app.put("/productos/:id", async (req, res) => {
  const { id } = req.params;
  const datosActualizados = req.body;

  try {
    const productoActualizado = await Computer.findByIdAndUpdate(id, datosActualizados, { new: true });
    if (productoActualizado) {
      res.json(productoActualizado);
    } else {
      res.status(404).send("Producto no encontrado.");
    }
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).send("Error interno del servidor al actualizar el producto.");
  }
});

// Obtener un producto por su código
app.get("/productos/:codigo", async (req, res) => {
  const { codigo } = req.params;
  const filtro = { codigo: parseInt(codigo) }; // Convertir codigo a número

  try {
    const producto = await Computer.findOne(filtro);
    if (producto) {
      res.json(producto);
    } else {
      res.status(404).send("No se encontró ningún producto con ese código.");
    }
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).send("Error interno del servidor al obtener el producto.");
  }
});

// Agregar un nuevo producto
app.post("/productos", async (req, res) => {
  const nuevoProducto = new Computer(req.body);

  try {
    const productoExistente = await Computer.findOne({ nombre: nuevoProducto.nombre });
    if (productoExistente) {
      return res.status(400).send("Ya existe un producto con ese nombre.");
    }

    const productoGuardado = await nuevoProducto.save();
    res.status(201).json(productoGuardado);
  } catch (error) {
    console.error("Error al agregar el producto:", error);
    res.status(500).send("Error interno del servidor al agregar el producto.");
  }
});

// Eliminar un producto por su ID
app.delete("/productos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const productoEliminado = await Computer.findByIdAndDelete(id);
    if (productoEliminado) {
      res.status(204).send(); // No Content (éxito)
    } else {
      res.status(404).send("El producto que se intenta eliminar no existe.");
    }
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.status(500).send("Error interno del servidor al eliminar el producto.");
  }
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).send("Ruta no encontrada.");
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});