const express = require("express");
const { getPenalty } = require("./penalty.controllers");

const router = express.Router();

router.get("/penalty", getPenalty);

module.exports = router;
