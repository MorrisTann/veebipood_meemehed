require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const knex = require("knex")({
  client: "pg",
  connection: process.env.DATABASE_URL,
});

const app = express();

// CORS seaded, et lubada ühendus React frontendiga
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
}));
app.use(express.json());

// JWT salajane võti ja serveri URL
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const SERVER_URL = process.env.SERVER_URL || "http://localhost:5000";

// Nodemailer transpordisäted kasutades .env väärtusi
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.example.com",
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_PORT == 465, // secure true port 465 puhul
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// --- TOOTED ENDPOINTID ---

// Kõigi toodete päring
app.get("/api/products", async (req, res) => {
  try {
    const products = await knex("products").select("*");
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Serveri viga" });
  }
});

// Ühe toote detailide päring
app.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await knex("products").where({ id }).first();
    if (!product) return res.status(404).json({ error: "Toodet ei leitud" });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Serveri viga" });
  }
});

// --- KASUTAJATE ENDPOINTID ---

// Registreerimine koos emaili kinnituse funktsiooniga
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;
  // Serveripoolne emaili kontroll
  if (!/\S+@\S+\.\S+/.test(email))
    return res.status(400).json({ error: "Kehtetu email" });
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const confirmationToken = crypto.randomBytes(32).toString("hex");

    await knex("users").insert({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
      confirmationToken,
    });

    const confirmLink = `${SERVER_URL}/api/confirm/${confirmationToken}`;
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Kinnita oma konto",
      html: `<p>Tere, ${username}!</p>
             <p>Palun kinnita oma konto, klõpsades <a href="${confirmLink}">siin</a>.</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Kinnituskirja saatmine ebaõnnestus:", error);
      } else {
        console.log("Kinnituskiri saadetud:", info.response);
      }
    });

    res.status(201).json({ message: "Kasutaja loodud! Kontrolli oma emaili kinnitamiseks." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Serveri viga" });
  }
});

// Konto kinnitamise endpoint
app.get("/api/confirm/:token", async (req, res) => {
  const { token } = req.params;
  try {
    const user = await knex("users").where({ confirmationToken: token }).first();
    if (!user) return res.status(404).send("Kehtetu kinnituslink");
    await knex("users")
      .where({ id: user.id })
      .update({ isVerified: true, confirmationToken: null });
    res.send("Konto kinnitatud! Nüüd saate sisse logida.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Serveri viga.");
  }
});

// Sisselogimine
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!/\S+@\S+\.\S+/.test(email))
    return res.status(400).json({ error: "Kehtetu email" });
  try {
    const user = await knex("users").where({ email }).first();
    if (!user) return res.status(404).json({ error: "Kasutajat ei leitud" });
    if (!user.isVerified)
      return res.status(403).json({ error: "Palun kinnita oma email." });
    if (!(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: "Vale parool" });
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Serveri viga" });
  }
});

// Kaitstud endpoint (näitab lihtsat sõnumit)
app.get("/api/protected", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ error: "Autoriseerimine puudub" });
  try {
    const user = jwt.verify(authHeader.split(" ")[1], JWT_SECRET);
    res.json({ message: `Tere, ${user.username}! See on kaitstud leht.` });
  } catch (err) {
    res.status(403).json({ error: "Autoriseerimine ebaõnnestus" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server töötab pordil ${PORT}`));
