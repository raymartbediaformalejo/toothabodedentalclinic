const { Router } = require("express");

const {
  getUsers,
  getUser,
  createUser,
  verifyEmail,
  resendVerificationCode,
  deleteUser,
  updateUserData,
  getUserAccountStatus,
  changePassword,
  getUserAppointmentNoShowSchedule,
} = require("./user.controllers");

const router = Router();

router.get("/user/single/:userId", getUser);
router.get("/user", getUsers);
router.get("/user/:userId/account-status", getUserAccountStatus);
router.get(
  "/user/:userId/no-show-appointment",
  getUserAppointmentNoShowSchedule
);
router.post("/user/signup", createUser);
router.post("/user/verifyEmail", verifyEmail);
router.post("/resend-code", resendVerificationCode);
router.patch("/user/changepassword/:id", changePassword);
router.patch("/user/:id", updateUserData);
router.delete("/users/:userId", deleteUser);

module.exports = router;
