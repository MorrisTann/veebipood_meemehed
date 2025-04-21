const express = require("express");
const router = express.Router();
const {
  createCheckoutSession,
  getUserOrders,
  getGuestOrders,
  attachOrdersToUser,
  markOrderPaid,
} = require("../controllers/orderController");

router.post("/create-checkout-session", createCheckoutSession);
router.get("/orders", getUserOrders);
router.get("/guest-orders", getGuestOrders);
router.put("/attach-orders-to-user", attachOrdersToUser);
router.post("/mark-order-paid", markOrderPaid);

module.exports = router;
