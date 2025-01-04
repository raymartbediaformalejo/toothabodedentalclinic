const express = require("express");

const {
  getAppointmentPatientInfo,
  getAppointmentPatientInfos,
} = require("./appointmentPatientInfo.controllers");

const router = express.Router();

router.get("/appointment-patient-info/:id", getAppointmentPatientInfo);
router.get("/appointment-patient-info", getAppointmentPatientInfos);

module.exports = router;
