const { Router } = require("express");
const {
  markAsIncomplete,
  markAsOverpaid,
  markAsVerified,
  getPaymentVerification,
  getPaymentVerifications,
  createPaymentVerification,
  updatePaymentVerification,
  deletePaymentVerification,
} = require("./payment-verification.controllers");

const router = Router();

router.patch("/mark-verified-payment-verification/:id", markAsVerified);
router.patch("/mark-incomplete-payment-verification/:id", markAsIncomplete);
router.patch("/mark-overpaid-payment-verification/:id", markAsOverpaid);
router.get("/payment-verification/:id", getPaymentVerification);
router.get("/payment-verification", getPaymentVerifications);
router.post("/payment-verification", createPaymentVerification);
router.patch("/payment-verification/:id", updatePaymentVerification);
router.delete("/payment-verification/:id", deletePaymentVerification);

module.exports = router;
