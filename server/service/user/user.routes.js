const { Router } = require("express");

const { getUsers, getUser, createUser } = require("./user.controllers");

const router = Router();

router.get("/user/:userId", getUser);
router.get("/user", getUsers);
router.post("/user/signup", createUser);

module.exports = router;
