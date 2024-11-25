const express = require("express");
const router = express.Router();
const { login, logout, refresh } = require("./auth.controllers");
const loginLimiter = require("../../middleware/loginLimitter");

router.route("/auth").post(loginLimiter, login);
router.route("/auth/refresh").get(refresh);
router.route("/auth/logout").post(logout);

module.exports = router;
