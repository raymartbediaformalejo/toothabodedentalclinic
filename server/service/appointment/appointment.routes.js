const express = require("express");
const {
  markAsCanceled,
  markAsCompleted,
  markAsNoShow,
  getSchedule,
  getAllAppointments,
  getAppointment,
  getDentistAppointments,
  createAppointment,
  editAppointment,
  requestRescheduleAppointment,
  approveAppointment,
  cancelAppointment,
  rejectAppointment,
  getAllPedingAppointments,
  getDentistPedingAppointments,
  getDentistReScheduleAppointments,
  getAllRequestingReschedAppointments,
  getPatientAppointments,
  approveRequestRescheduleAppointment,
  rejectRequestRescheduleAppointment,
} = require("./appointment.controllers");

const router = express.Router();

router.get("/appointment", getAllAppointments);

router.get("/appointment/:appointmentId", getAppointment);

router.get("/appointment-schedule/:appointmentId", getSchedule);

router.get("/appointment/:dentistId/dentist", getDentistAppointments);

router.get("/appointment/:patientId/patient", getPatientAppointments);

router.get("/pending-appointment", getAllPedingAppointments);

router.get(
  "/request-re-schedule-appointment",
  getAllRequestingReschedAppointments
);

router.patch("/approve-reschedule", approveRequestRescheduleAppointment);

router.patch("/reject-reschedule", rejectRequestRescheduleAppointment);

router.patch("/mark-as-canceled-appointment", markAsCanceled);

router.patch("/mark-as-no-show-appointment", markAsNoShow);

router.patch("/mark-as-completed-appointment", markAsCompleted);

router.get(
  "/appointment/pending/:dentistId/dentist",
  getDentistPedingAppointments
);

router.get(
  "/appointment/re_schedule/:dentistId/dentist",
  getDentistReScheduleAppointments
);

router.patch("/appointment/request-reschedule", requestRescheduleAppointment);

router.patch("/approve-appointment", approveAppointment);

router.patch("/reject-appointment", rejectAppointment);

router.patch("/appointment/cancel/:id", cancelAppointment);

router.post("/appointment", createAppointment);

router.put("/appointment/:appointmentId", editAppointment);

module.exports = router;
