const transporter = require("../services/emailService");

const sendInvoiceEmail = async ({ order, orderItems, to }) => {
  const itemRows = orderItems.map(item => `
    <tr>
      <td>${item.name}</td>
      <td style="text-align: center;">${item.quantity}</td>
      <td style="text-align: right;">${Number(item.price).toFixed(2)} €</td>
    </tr>
  `).join("");

  const shippingDetails = `
    <p><strong>Tarneviis:</strong> ${order.shipping_method || "-"}<br />
    ${order.terminal_name ? `<strong>Pakiautomaat:</strong> ${order.terminal_name}<br />` : ""}
    ${order.pickup_location ? `<strong>Asukoht:</strong> ${order.pickup_location}<br />` : ""}
    <strong>Aadress:</strong> ${order.address1 || ""} ${order.address2 || ""}, ${order.city || ""} ${order.postal_code || ""}, ${order.country || ""}</p>
  `;

  const html = `
    <div style="font-family: sans-serif; padding: 20px; background-color: #f7f7f7;">
      <div style="max-width: 700px; margin: auto; background: white; padding: 30px; border-radius: 8px;">
        <h2 style="text-align: center; color: #333;">Tellimus #${order.id}</h2>

        <hr style="margin: 20px 0;" />

        <p><strong>Tellija:</strong> ${order.name}</p>
        <p><strong>Email:</strong> ${order.customer_email}</p>
        ${order.company ? `<p><strong>Ettevõte:</strong> ${order.company}</p>` : ""}
        ${order.vat ? `<p><strong>KMKR:</strong> ${order.vat}</p>` : ""}
        <p><strong>Tellimuse kuupäev:</strong> ${new Date(order.order_date).toLocaleString()}</p>

        ${shippingDetails}

        <table style="width: 100%; border-collapse: collapse; margin-top: 30px;">
          <thead>
            <tr>
              <th style="text-align: left;">Toode</th>
              <th style="text-align: center;">Kogus</th>
              <th style="text-align: right;">Hind</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>

        <p style="text-align: right; margin-top: 20px; font-weight: bold;">
            Kokku: ${Number(order.total_price).toFixed(2)} €
        </p>

        <hr style="margin: 30px 0;" />
        <p style="text-align: center; margin-top: 40px; font-size: 16px;">
        📦 Tooted on peagi sinuga! Aitäh tellimuse eest!
        </p>
        <p>Kui sul on küsimusi, võta meiega julgelt ühendust.<br />
        E-post: <a href="mailto:meemehed@gmail.com">meemehed@gmail.com</a><br />
        Telefon: <a href="tel:+37256992860">+372 5699 2860</a><br />
        Meemehed 🍯</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: `Tellimus #${order.id}`,
    html,
  });
};

module.exports = sendInvoiceEmail;
