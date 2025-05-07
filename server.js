require("dotenv").config();
const express = require("express");
const compression = require("compression");
const cors = require("cors");
const path = require("path");

const app = express();

// Gzip compression
app.use(compression());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
}));

// Stripe webhook - must come before express.json()
app.post("/api/stripe/webhook", express.raw({ type: "application/json" }));
const stripeWebhook = require("./routes/stripeWebhook");
app.use("/api/stripe/webhook", stripeWebhook);

// JSON parser for all other requests
app.use(express.json());

// API routes
app.use("/api", require("./routes/authRoutes"));
app.use("/api", require("./routes/productRoutes"));
app.use("/api", require("./routes/orderRoutes"));
app.use("/api", require("./routes/newsletterRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// Serve static files from React app with long-term caching
app.use(express.static(path.join(__dirname, "client", "build"), {
  maxAge: "1y",
  etag: false,
}));

// SPA fallback for client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server töötab pordil ${PORT}`));
