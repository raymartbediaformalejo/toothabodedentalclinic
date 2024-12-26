const express = require("express");
const AppointmentController = require("./appointment.controllers");

const router = express.Router();

router.post("/appointment", AppointmentController.createAppointment);

module.exports = router;
