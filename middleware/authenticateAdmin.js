const jwt = require("jsonwebtoken");

const ADMIN_EMAIL = "meemehed.kinnitus@gmail.com";

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ error: "Admini autentimine puudub" });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");

    if (decoded.email !== ADMIN_EMAIL) {
      return res.status(403).json({ error: "Ligipääs keelatud – mitte admin" });
    }

    req.user = decoded; // kui vajad hiljem
    next();
  } catch (err) {
    console.error("Admini autentimine ebaõnnestus:", err);
    res.status(403).json({ error: "Admini autentimine ebaõnnestus" });
  }
};
