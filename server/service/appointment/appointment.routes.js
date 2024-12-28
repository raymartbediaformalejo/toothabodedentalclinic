const express = require("express");
const { createAppointment } = require("./appointment.controllers");

const router = express.Router();

router.post("/appointment", createAppointment);

module.exports = router;
