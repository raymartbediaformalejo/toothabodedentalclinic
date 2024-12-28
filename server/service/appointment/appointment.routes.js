const express = require("express");
const {
  getAppointment,
  getAppointments,
  createAppointment,
  editAppointment,
} = require("./appointment.controllers");

const router = express.Router();

router.get("/appointment", getAppointments);

router.get("/appointment/:appointmentId", getAppointment);

router.post("/appointment", createAppointment);

router.put("/appointment/:appointmentId", editAppointment);

module.exports = router;
