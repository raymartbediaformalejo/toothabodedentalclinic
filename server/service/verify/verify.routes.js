const express = require("express");
const router = express.Router();

const verify = require("./../../service/verify/verify.controllers.js");

router.get("/auth/verify", verify);

module.exports = router;
