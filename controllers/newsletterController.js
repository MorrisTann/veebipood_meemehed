const knex = require("../db/knex");

exports.getNewsletterStatus = async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email puudub" });

  try {
    const existing = await knex("newsletter_subscriptions").where({ email }).first();
    res.json({ subscribed: existing?.subscribed || false });
  } catch (err) {
    console.error("Uudiskirja staatuse pärimine ebaõnnestus:", err);
    res.status(500).json({ error: "Serveri viga" });
  }
};

exports.updateNewsletterSubscription = async (req, res) => {
  const { email, subscribed } = req.body;
  if (!email || typeof subscribed !== "boolean") {
    return res.status(400).json({ error: "Vigane sisend" });
  }

  try {
    const existing = await knex("newsletter_subscriptions").where({ email }).first();

    if (existing) {
      await knex("newsletter_subscriptions")
        .where({ email })
        .update({ subscribed, subscribed_at: new Date() });
    } else {
      await knex("newsletter_subscriptions").insert({
        email,
        subscribed,
        subscribed_at: new Date(),
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Uudiskirja tellimuse uuendamine ebaõnnestus:", err);
    res.status(500).json({ error: "Serveri viga" });
  }
};
