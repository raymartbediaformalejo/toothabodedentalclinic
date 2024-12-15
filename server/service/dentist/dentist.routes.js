const { Router } = require("express");
const {
  getDentists,
  createDentist,
  getDentist,
  saveSortedDentist,
  deleteAllDentists,
  deleteDentist,
  updateDentist,
  changePassword,
} = require("./dentist.controllers");

const router = Router();

router.get("/dentist", getDentists);
router.get("/dentist/:dentistId", getDentist);
router.post("/dentist", createDentist);
router.patch("/dentist/changepassword/:id", changePassword);
router.patch("/dentist/save/sortedDentist", saveSortedDentist);
router.patch("/dentist/delete/all", deleteAllDentists);
router.patch("/dentist/delete/:dentistId", deleteDentist);
router.patch("/dentist/:dentistId", updateDentist);

module.exports = router;
