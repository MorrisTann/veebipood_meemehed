const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const knex = require("../db/knex");
const transporter = require("../services/emailService");
const { validateEmail } = require("../utils/validateEmail");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const SERVER_URL = process.env.SERVER_URL || "http://localhost:5000";

exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;
  
    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Kehtetu email" });
    }
  
    try {
      // Kontrolli kas email või username on juba kasutusel
      const existingUser = await knex("users")
        .where("email", email)
        .orWhere("username", username)
        .first();
  
      if (existingUser) {
        if (existingUser.email === email) {
          return res.status(409).json({ error: "E-mail on juba kasutusel! Proovi sisse logida." });
        }
        if (existingUser.username === username) {
          return res.status(409).json({ error: "Kasutajanimi on juba kasutusel!" });
        }
      }
  
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
        html: `
          <div style="font-family: sans-serif; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <h2 style="color: #333;">Tere, ${username}!</h2>
              <p>Aitäh, et registreerusite Meemeeste e-poodi!</p>
              <p>Palun kinnita oma konto, klõpsates alloleval nupul:</p>
              <p style="text-align: center; margin: 30px 0;">
                <a href="${confirmLink}" style="padding: 12px 24px; background-color: #000; color: white; text-decoration: none; border-radius: 5px;">Kinnita konto</a>
              </p>
              <p>Kui sa ei registreerunud, võid selle kirja lihtsalt ignoreerida.</p>
              <p>Meemehed 🍯</p>
            </div>
          </div>
        `
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(201).json({ message: "Kasutaja loodud! Kontrolli oma emaili." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Serveri viga" });
    }
  };
  

  exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password)
      return res.status(400).json({ error: "Email/kasutajanimi ja parool on kohustuslikud." });
  
    try {
      const user = await knex("users")
        .where("email", email)
        .orWhere("username", email)
        .first();
  
      if (!user)
        return res.status(404).json({ error: "Kasutajat ei leitud." });
  
      if (!user.isVerified)
        return res.status(403).json({ error: "Palun kinnita oma email enne sisselogimist." });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ error: "Vale parool." });
  
      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email  },
        process.env.JWT_SECRET || "supersecretkey",
        { expiresIn: "1h" }
      );
  
      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (err) {
      console.error("Sisselogimine ebaõnnestus:", err);
      res.status(500).json({ error: "Serveri viga" });
    }
  };
  

exports.confirmUser = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await knex("users").where({ confirmationToken: token }).first();
    if (!user) return res.status(404).send("Kehtetu kinnituslink");
    await knex("users").where({ id: user.id }).update({ isVerified: true, confirmationToken: null });
    res.redirect(`${process.env.FRONTEND_URL}/login?confirmed=true`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Serveri viga.");
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await knex("users").where({ email }).first();
    if (!user) return res.status(404).json({ error: "Sellist kasutajat ei eksisteeri." });
    const resetToken = crypto.randomBytes(32).toString("hex");
    await knex("users").where({ id: user.id }).update({
      resetToken,
      resetTokenExpires: new Date(Date.now() + 3600000),
    });
    const resetLink = `${process.env.FRONTEND_URL}/muuda-parool/${resetToken}`;
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Parooli taastamine",
      html: `
        <div style="font-family: sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #333;">Parooli muutmise taotlus</h2>
            <p>Tundub, et soovisid oma parooli muuta.</p>
            <p>Klõpsa alloleval nupul, et minna parooli muutmise lehele:</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="padding: 12px 24px; background-color: #000; color: white; text-decoration: none; border-radius: 5px;">Muuda parooli</a>
            </p>
            <p>Kui see ei olnud sina, siis võid selle kirja ignoreerida.</p>
            <p>Meemehed 🍯</p>
          </div>
        </div>
      `
    });
    res.json({ message: "Parooli taastamise link saadeti emailile." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Serveri viga." });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const user = await knex("users")
      .where({ resetToken: token })
      .andWhere("resetTokenExpires", ">", new Date())
      .first();
    if (!user) return res.status(400).json({ error: "Kehtetu või aegunud link" });
    const hashed = await bcrypt.hash(password, 10);
    await knex("users")
      .where({ id: user.id })
      .update({ password: hashed, resetToken: null, resetTokenExpires: null });
    res.json({ message: "Parool edukalt muudetud" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Serveri viga" });
  }
};

exports.getProtectedUser = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Autoriseerimine puudub" });
  try {
    const user = jwt.verify(authHeader.split(" ")[1], JWT_SECRET);
    res.json({ id: user.id, username: user.username, email: user.email });
  } catch (err) {
    res.status(403).json({ error: "Autoriseerimine ebaõnnestus" });
  }
};
