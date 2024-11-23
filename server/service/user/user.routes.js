const { Router } = require("express");

const { getUsers, createUser } = require("./user.controllers");

const router = Router();

router.get("/user", getUsers);
router.post("/user/signup", createUser);

module.exports = router;
