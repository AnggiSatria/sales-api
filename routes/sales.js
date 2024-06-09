const express = require("express");
const router = express.Router();
const Sales = require("../models/sales");

// Middleware untuk memvalidasi tanggal
function validateDate(req, res, next) {
  const { start_date, end_date } = req.query;

  if (start_date && isNaN(Date.parse(start_date))) {
    return res.status(400).json({ message: "Invalid start_date" });
  }

  if (end_date && isNaN(Date.parse(end_date))) {
    return res.status(400).json({ message: "Invalid end_date" });
  }

  next();
}

router.get("/", validateDate, async (req, res) => {
  const { product, start_date, end_date } = req.query;
  const query = {};

  if (product) {
    query.product = { $regex: product, $options: "i" }; // 'i' for case-insensitive
  }

  if (start_date || end_date) {
    query.date = {};
    if (start_date) query.date.$gte = new Date(start_date);
    if (end_date) query.date.$lte = new Date(end_date);
  }

  try {
    const sales = await Sales.find(query);
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new sale
router.post("/", async (req, res) => {
  const sale = new Sales({
    product: req.body.product,
    date: req.body.date,
    sales: req.body.sales,
    revenue: req.body.revenue,
  });

  try {
    const newSale = await sale.save();
    res.status(201).json(newSale);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a sale
router.delete("/:id", async (req, res) => {
  try {
    await Sales.findByIdAndDelete(req.params.id);
    res.json({ message: "Sale deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT to update a sale
router.put("/:id", async (req, res) => {
  try {
    const sale = await Sales.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    sale.product = req.body.product;
    sale.date = req.body.date;
    sale.sales = req.body.sales;
    sale.revenue = req.body.revenue;

    const updatedSale = await sale.save();
    res.json(updatedSale);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
