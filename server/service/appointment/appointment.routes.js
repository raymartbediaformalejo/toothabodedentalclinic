const express = require("express");
const {
  getAppointment,
  getAppointments,
  getDentistAppointments,
  createAppointment,
  editAppointment,
  approveAppointment,
  cancelAppointment,
  rejectAppointment,
  getDentistPedingAppointments,
  getDentistReScheduleAppointments,
  getPatientAppointments,
} = require("./appointment.controllers");

const router = express.Router();

router.get("/appointment", getAppointments);

router.get("/appointment/:appointmentId", getAppointment);

router.get("/appointment/:dentistId/dentist", getDentistAppointments);

router.get("/appointment/:patientId/patient", getPatientAppointments);

router.get(
  "/appointment/pending/:dentistId/dentist",
  getDentistPedingAppointments
);

router.get(
  "/appointment/re_schedule/:dentistId/dentist",
  getDentistReScheduleAppointments
);

router.patch("/appointment/approve", approveAppointment);

router.patch("/appointment/reject", rejectAppointment);

router.patch("/appointment/cancel/:id", cancelAppointment);

router.post("/appointment", createAppointment);

router.put("/appointment/:appointmentId", editAppointment);

module.exports = router;
