const { Router } = require("express");

const { getServices } = require("./service.controllers");

const router = Router();

router.get("/service", getServices);

module.exports = router;
