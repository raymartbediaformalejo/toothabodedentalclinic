const express = require("express");
const router = express.Router();
const { loginUser, logout } = require("./auth.controllers");
const loginLimiter = require("../../middleware/loginLimitter");

router.route("/auth/signin").post(loginLimiter, loginUser);
router.route("/auth/logout").post(logout);

module.exports = router;
