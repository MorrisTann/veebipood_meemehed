const knex = require("../db/knex");

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await knex("orders").orderBy("order_date", "desc");

    const fullOrders = await Promise.all(
      orders.map(async (order) => {
        const items = await knex("order_items").where({ order_id: order.id });
        return {
          ...order,
          order_items: items,
        };
      })
    );

    res.json(fullOrders);
  } catch (err) {
    console.error("Tellimuste laadimine ebaõnnestus (admin):", err);
    res.status(500).json({ error: "Tellimuste laadimine ebaõnnestus" });
  }
};
