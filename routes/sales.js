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

// GET all sales
router.get("/", async (req, res) => {
  try {
    const sales = await Sales.find();
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET sales by product
router.get("/product", async (req, res) => {
  const product = req.query.product;
  try {
    const sales = await Sales.find({ product: product });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET sales by date range
// router.get("/date", async (req, res) => {
//   const startDate = new Date(req.query.start_date);
//   const endDate = new Date(req.query.end_date);
//   try {
//     const sales = await Sales.find({
//       date: {
//         $gte: startDate,
//         $lte: endDate,
//       },
//     });
//     res.json(sales);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

router.get("/date", validateDate, async (req, res) => {
  const { start_date, end_date } = req.query;

  try {
    const sales = await Sales.find({
      date: {
        $gte: start_date ? new Date(start_date) : new Date("1970-01-01"),
        $lte: end_date ? new Date(end_date) : new Date(),
      },
    });
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
