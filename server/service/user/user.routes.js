const { Router } = require("express");

const {
  getUsers,
  getUser,
  createUser,
  verifyEmail,
  deleteUser,
} = require("./user.controllers");

const router = Router();

router.get("/user/:userId", getUser);
router.get("/user", getUsers);
router.post("/user/signup", createUser);
router.post("/user/verifyEmail", verifyEmail);
router.delete("/users/:userId", deleteUser);

module.exports = router;
