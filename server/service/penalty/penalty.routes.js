const express = require("express");
const {
  getPenalty,
  updatePenaltyFee,
  createPenalty,
} = require("./penalty.controllers");

const router = express.Router();

router.get("/penalty", getPenalty);
router.patch("/penalty", updatePenaltyFee);
router.post("/penalty", createPenalty);

module.exports = router;
