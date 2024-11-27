const { Router } = require("express");

const {
  getService,
  getServices,
  createService,
  updateService,
  deleteService,
  deleteAllServices,
} = require("./service.controllers");

const router = Router();

router.get("/service", getServices);
router.get("/service/:serviceId", getService);
router.post("/service", createService);
router.patch("/service/deleteAll", deleteAllServices);
router.patch("/service/:serviceId", updateService);
router.patch("/service/delete/:serviceId", deleteService);

module.exports = router;
