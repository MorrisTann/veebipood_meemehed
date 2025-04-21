const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const knex = require("../db/knex");
const sendInvoiceEmail = require("../utils/sendInvoiceEmail");

router.post("/", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const stripeSessionId = session.id;

    console.log("Webhook tuli. Kontrollin session ID:", stripeSessionId);

    const order = await knex("orders")
      .where({ stripe_session_id: stripeSessionId })
      .first();

    if (order && !order.is_paid) {
      console.log("Order leitud. Märgin makstuks. Order ID:", order.id);

      await knex("orders").where({ id: order.id }).update({ is_paid: true });

      const orderItems = await knex("order_items").where({ order_id: order.id });

      console.log("Alustan laoseisu vähendamist.");
      for (const item of orderItems) {
        console.log("Toode:", item.name, "| product_id:", item.product_id, "| quantity:", item.quantity);

        const isShippingItem = item.name.toLowerCase().includes("tarne");

        if (item.product_id && !isShippingItem) {
          const result = await knex("products")
            .where({ id: item.product_id })
            .update({
              stock: knex.raw("GREATEST(stock - ?, 0)", [item.quantity])
            });

          console.log("Stock update tulemus product_id", item.product_id, ":", result);
        } else {
          console.log("Jäetakse vahele - puudub product_id või on tarne rida.");
        }
      }

      await sendInvoiceEmail({ order, orderItems, to: order.customer_email });
      await sendInvoiceEmail({ order, orderItems, to: "meemehed.kinnitus@gmail.com" });

    } else {
      console.warn("Orderit ei leitud session ID järgi või on juba makstud:", stripeSessionId);
    }
  }

  res.json({ received: true });
});

module.exports = router;
