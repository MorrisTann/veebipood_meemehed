const express = require("express");
const router = express.Router();
const db = require("../db/knex");
const jwt = require("jsonwebtoken");
const adminAuth = require("../middleware/authenticateAdmin");

// GET /api/admin/all-orders – kõik tellimused koos toodetega
router.get("/all-orders", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Autoriseerimine puudub" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");

    if (decoded.email !== "meemehed.kinnitus@gmail.com") {
      return res.status(403).json({ error: "Ligipääs keelatud – ainult adminile" });
    }

    const orders = await db("orders").orderBy("order_date", "desc");

    const fullOrders = await Promise.all(
      orders.map(async (order) => {
        const items = await db("order_items").where({ order_id: order.id });
        return {
          ...order,
          order_items: items,
        };
      })
    );

    res.json(fullOrders);
  } catch (err) {
    console.error("Admin tellimuste viga:", err);
    return res.status(401).json({ error: "Vale või aegunud token" });
  }
});

// PUT /api/admin/update-stock/:id – uuenda konkreetse toote laoseisu
router.put("/update-stock/:id", adminAuth, async (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;

  if (stock == null || isNaN(stock)) {
    return res.status(400).json({ error: "Laoseisu väärtus puudub või ei ole number" });
  }

  try {
    await db("products").where({ id }).update({ stock });
    res.json({ message: "Laoseis uuendatud", productId: id, newStock: stock });
  } catch (err) {
    console.error("Laoseisu uuendamise viga:", err);
    res.status(500).json({ error: "Laoseisu uuendamine ebaõnnestus" });
  }
});

module.exports = router;
