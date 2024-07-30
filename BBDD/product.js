const mongoose = require("mongoose");
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const COLLECTION_NAME = process.env.COLLECTION_NAME;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI no está definido en el archivo .env');
  process.exit(1);
}

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectando con MongoDB'))
  .catch(error => {
	console.error('Error al intentar conectar con MongoDB:', error);
	process.exit(1);
  });

const computerSchema = new mongoose.Schema(
  {
	codigo: Number,
	nombre: { type: String, required: true },
	precio: { type: Number, required: true },
	categoria: { type: String, required: true },
  },
  { collection: COLLECTION_NAME }
);

const Computer = mongoose.model("Computer", computerSchema);

module.exports = Computer;