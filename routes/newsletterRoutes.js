const express = require("express");
const router = express.Router();
const {
  getNewsletterStatus,
  updateNewsletterSubscription,
} = require("../controllers/newsletterController");

router.get("/newsletter", getNewsletterStatus);
router.post("/newsletter", updateNewsletterSubscription);

module.exports = router;
