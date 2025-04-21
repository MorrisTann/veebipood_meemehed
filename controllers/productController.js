const knex = require("../db/knex");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await knex("products")
      .select("*")
      .orderByRaw("CASE WHEN stock = 0 THEN 1 ELSE 0 END")
      .orderBy("id", "asc");
    res.json(products);
  } catch (err) {
    console.error("Viga toodete laadimisel:", err);
    res.status(500).json({ error: "Serveri viga" });
  }
};



exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await knex("products").where({ id }).first();
    if (!product) return res.status(404).json({ error: "Toodet ei leitud" });
    res.json(product);
  } catch (err) {
    console.error("Viga toote leidmisel:", err);
    res.status(500).json({ error: "Serveri viga" });
  }
};