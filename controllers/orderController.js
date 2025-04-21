const knex = require("../db/knex");
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

exports.createCheckoutSession = async (req, res) => {
  const { items, customer } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  try {
    let userId = null;
    let customerEmail = customer?.email || null;

    if (token && token !== "null" && token !== "undefined") {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        console.warn("JWT token vigane või kehtetu:", err.message);
      }
    }

    const trx = await knex.transaction();

    try {
      const productIds = items.filter(i => i.id).map(i => i.id);
      const productStocks = await trx("products")
        .select("id", "stock")
        .whereIn("id", productIds)
        .forUpdate();

      const stockMap = Object.fromEntries(productStocks.map(p => [p.id, p.stock]));
      const over = items.find(i => i.id && i.quantity > (stockMap[i.id] ?? 0));

      if (over) {
        await trx.rollback();
        const laoseis = stockMap[over.id] ?? 0;
        return res.status(400).json({
          error: laoseis === 0
            ? `${over.name} on laost otsas`
            : `${over.name} – laos on vaid ${laoseis} tk`,
        });
      }
      

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        metadata: {
          customer_email: customerEmail,
        },
        customer_email: customerEmail,
        line_items: items.map(item => ({
          price_data: {
            currency: "eur",
            product_data: { name: item.name },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        })),
        success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment?restore=true`,
      });

      const [orderId] = await trx("orders")
        .insert({
          user_id: userId,
          stripe_session_id: session.id,
          customer_email: customerEmail,
          name: customer.name,
          phone: customer.phone,
          company: customer.company,
          vat: customer.vat,
          address1: customer.address1,
          address2: customer.address2,
          city: customer.city,
          country: customer.country,
          postal_code: customer.postalCode,
          shipping_method: customer.shippingMethod,
          pickup_location: customer.pickupLocation,
          terminal_name: customer.terminalName,
          order_date: new Date(),
          total_price: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
          is_paid: false,
        })
        .returning("id");

      const orderItems = items.map(item => ({
        order_id: orderId.id || orderId,
        product_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      await trx("order_items").insert(orderItems);

      // NB: mitte vähendame stocki veel — see jääb webhooki teha peale makset
      await trx.commit();

      res.json({ url: session.url });
    } catch (error) {
      await trx.rollback();
      console.error("Transaction error:", error);
      res.status(500).json({ error: "Tellimuse loomine ebaõnnestus" });
    }
  } catch (err) {
    console.error("Stripe või tellimuse loomine ebaõnnestus:", err);
    res.status(500).json({ error: "Makse seansi loomine ebaõnnestus" });
  }
};


exports.getUserOrders = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    if (!token) return res.status(401).json({ error: "Autoriseerimine puudub" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await knex("users").where({ id: decoded.id }).first();

    const orders = await knex("orders")
      .where(function () {
        this.where({ user_id: decoded.id })
          .orWhereRaw("LOWER(TRIM(customer_email)) = LOWER(TRIM(?))", [user.email]);
      })
      .andWhere("is_paid", true)
      .orderBy("order_date", "desc");

    const fullOrders = await Promise.all(
      orders.map(async (order) => {
        const items = await knex("order_items").where({ order_id: order.id });
        return { ...order, order_items: items };
      })
    );

    res.json(fullOrders);
  } catch (err) {
    console.error("Tellimuste laadimine ebaõnnestus:", err);
    res.status(500).json({ error: "Tellimuste laadimine ebaõnnestus" });
  }
};

exports.getGuestOrders = async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ error: "Email on kohustuslik" });
  }

  try {
    const orders = await knex("orders")
      .whereRaw("LOWER(TRIM(customer_email)) = LOWER(TRIM(?))", [email])
      .andWhere("is_paid", true)
      .orderBy("order_date", "desc");

    const fullOrders = await Promise.all(
      orders.map(async (order) => {
        const items = await knex("order_items").where({ order_id: order.id });
        return { ...order, order_items: items };
      })
    );

    res.json(fullOrders);
  } catch (err) {
    console.error("Guest tellimuste laadimine ebaõnnestus:", err);
    res.status(500).json({ error: "Guest tellimuste laadimine ebaõnnestus" });
  }
};

exports.attachOrdersToUser = async (req, res) => {
  const { email, userId } = req.body;

  if (!email || !userId) {
    return res.status(400).json({ error: "Email ja userId on kohustuslikud" });
  }

  try {
    const updated = await knex("orders")
      .where({ customer_email: email })
      .whereNull("user_id")
      .update({ user_id: userId });

    res.json({ updatedCount: updated });
  } catch (err) {
    console.error("Tellimuste sidumine ebaõnnestus:", err);
    res.status(500).json({ error: "Serveri viga" });
  }
};

exports.markOrderPaid = async (req, res) => {
  const { session_id } = req.body;

  if (!session_id) {
    return res.status(400).json({ error: "Session ID puudub" });
  }

  try {
    const order = await knex("orders").where({ stripe_session_id: session_id }).first();

    if (!order) {
      return res.status(404).json({ error: "Tellimust ei leitud" });
    }

    if (!order.is_paid) {
      await knex("orders").where({ id: order.id }).update({ is_paid: true });
      console.log(`Order ${order.id} märgiti makstuks serveripoolselt`);
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Order märkimine ebaõnnestus:", err);
    res.status(500).json({ error: "Serveri viga" });
  }
};
