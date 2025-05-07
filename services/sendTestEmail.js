require("dotenv").config(); // Kui kasutad .env faili
const transporter = require("./emailService"); // impordi transpordi objekt

const mailOptions = {
  from: process.env.SMTP_USER,
  to: 'st-1-tykccgo@ft.glockdb.com',
  subject: 'Testmeil lingiga',
  text: 'See on testmeil. Palun külasta: https://mesimagus.ee',
  html: `
    <p>See on <b>testmeil</b>. Palun külasta: 
    <a href="https://mesimagus.ee">Muuda parool</a>
    </p>
  `
};


transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.error('Meili saatmise viga:', error);
  }
  console.log('Meil saadetud:', info.response);
});
