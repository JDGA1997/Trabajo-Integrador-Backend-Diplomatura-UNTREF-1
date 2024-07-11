const mongoose = require("mongoose");
process.loadEnvFile();

const URI = process.env.MONGODB_URI;

const connectDB = () => {
  return mongoose
    .connect(URI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => console.error("Error connecting: ", err));
};

module.exports = connectDB;