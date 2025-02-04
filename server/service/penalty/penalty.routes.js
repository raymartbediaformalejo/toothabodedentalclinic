const express = require("express");
const { getPenalty, updatePenaltyFee } = require("./penalty.controllers");

const router = express.Router();

router.get("/penalty", getPenalty);
router.patch("/penalty", updatePenaltyFee);

module.exports = router;
