const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const salesRoutes = require("./routes/sales");
const cors = require("cors");
require("dotenv").config(); // Memuat variabel lingkungan dari file .env

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/sales", salesRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Sales API");
});

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/salesdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
