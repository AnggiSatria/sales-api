const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema({
  product: { type: String, required: true },
  date: { type: Date, required: true },
  sales: { type: Number, required: true },
  revenue: { type: Number, required: true },
});

module.exports = mongoose.model("Sales", salesSchema);
