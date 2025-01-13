const express = require("express");

const {
  getAppointmentPatientInfo,
  getAppointmentPatientInfos,
  updatePatientInfo,
  deletePatientInfo,
  deleteAllPatientInfo,
} = require("./appointmentPatientInfo.controllers");

const router = express.Router();

router.get("/appointment-patient-info/:id", getAppointmentPatientInfo);
router.get("/appointment-patient-info", getAppointmentPatientInfos);
router.patch("/appointment-patient-info/:id", updatePatientInfo);
router.patch("/appointment-patient-info/delete/all", deleteAllPatientInfo);
router.patch("/appointment-patient-info/delete/:id", deletePatientInfo);
module.exports = router;
