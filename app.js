const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const salesRoutes = require("./routes/sales");

const app = express();
const PORT = 4000;

// Middleware
app.use(bodyParser.json());

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
