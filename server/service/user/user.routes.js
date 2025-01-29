const { Router } = require("express");

const {
  reactivateUserAccount,
  getUsers,
  getUser,
  getPatients,
  getPatientsOfDoctor,
  createUser,
  verifyEmail,
  resendVerificationCode,
  deleteUser,
  deleteAllUsers,
  updateUserData,
  getUserAccountStatus,
  changePassword,
  getUserAppointmentNoShowSchedule,
} = require("./user.controllers");

const router = Router();

router.get("/user/single/:userId", getUser);
router.get("/user", getUsers);
router.get("/user/patients", getPatients);
router.get("/user/:userId/account-status", getUserAccountStatus);
router.get("/user/:doctorId/patients", getPatientsOfDoctor);
router.patch("/reactivate-user/:userId", reactivateUserAccount);

router.get(
  "/user/:userId/no-show-appointment",
  getUserAppointmentNoShowSchedule
);
router.post("/user/signup", createUser);
router.post("/user/verifyEmail", verifyEmail);
router.post("/resend-code", resendVerificationCode);
router.patch("/user/changepassword/:id", changePassword);
router.patch("/user/:id", updateUserData);
router.patch("/user/delete/all", deleteAllUsers);
router.patch("/user/delete/:userId", deleteUser);

module.exports = router;
