const express = require("express");
const {
  getMedicalHistory,
  getAllMedicalHistory,
} = require("./medicalHistory.controllers");

const router = express.Router();

router.get("/medical-history/:id", getMedicalHistory);
router.get("/medical-history", getAllMedicalHistory);

module.exports = router;
