const { Router } = require("express");
const {
  getPaymentVerification,
  getPaymentVerifications,
  createPaymentVerification,
  updatePaymentVerification,
  deletePaymentVerification,
} = require("./payment-verification.controllers");

const router = Router();

router.get("/payment-verification/:id", getPaymentVerification);
router.get("/payment-verification", getPaymentVerifications);
router.post("/payment-verification", createPaymentVerification);
router.patch("/payment-verification/:id", updatePaymentVerification);
router.delete("/payment-verification/:id", deletePaymentVerification);

module.exports = router;
