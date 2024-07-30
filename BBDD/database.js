// Importa el módulo 'mongoose'
const mongoose = require("mongoose");
require('dotenv').config(); 

const URI = process.env.MONGODB_URLSTRING; 

const connectDB = () => {
  return mongoose
    .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true }) 
    .then(() => {
      console.log("Conectando con MongoDB");
    })
    .catch((err) => console.error("Error al intentar conectarse: ", err));
};

module.exports = connectDB;