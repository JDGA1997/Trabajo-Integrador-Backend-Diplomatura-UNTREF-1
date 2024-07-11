const mongoose = require("mongoose");
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB:', error));

const DATABASE_NAME = process.env.DATABASE_NAME;

const computerSchema = new mongoose.Schema(
  {
    codigo: Number,
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    categoria: { type: String, required: true },
  },
  { collection: DATABASE_NAME }
);

const Computer = mongoose.model("Computer", computerSchema);

module.exports = Computer;