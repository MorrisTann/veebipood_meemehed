const knex = require("../db/knex");
const slugify = require("slugify");

// GET /api/products – kõik tooted koos slug'iga
exports.getAllProducts = async (req, res) => {
  try {
    const products = await knex("products")
      .select("*")
      .orderByRaw("CASE WHEN stock = 0 THEN 1 ELSE 0 END")
      .orderBy("id", "asc");

    // Lisa slug iga toote juurde
    const productsWithSlugs = products.map((product) => ({
      ...product,
      slug: slugify(product.name, { lower: true, strict: true }),
    }));

    res.json(productsWithSlugs);
  } catch (err) {
    console.error("Viga toodete laadimisel:", err);
    res.status(500).json({ error: "Serveri viga" });
  }
};

// GET /api/products/:id – toode ID järgi
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await knex("products").where({ id }).first();
    if (!product) return res.status(404).json({ error: "Toodet ei leitud" });
    res.json(product);
  } catch (err) {
    console.error("Viga toote leidmisel ID alusel:", err);
    res.status(500).json({ error: "Serveri viga" });
  }
};

// GET /api/products/slug/:slug – toode slug'i järgi
exports.getProductBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const products = await knex("products").select("*");

    const matchedProduct = products.find(
      (product) =>
        slugify(product.name, { lower: true, strict: true }) === slug
    );

    if (!matchedProduct)
      return res.status(404).json({ error: "Toodet ei leitud slug'i järgi" });

    res.json(matchedProduct);
  } catch (err) {
    console.error("Viga toote leidmisel slug'i alusel:", err);
    res.status(500).json({ error: "Serveri viga" });
  }
};
