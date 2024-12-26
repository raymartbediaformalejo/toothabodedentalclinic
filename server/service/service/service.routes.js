const { Router } = require("express");

const {
  getService,
  getServices,
  getServicesById,
  createService,
  updateService,
  deleteService,
  deleteAllServices,
  saveSortedService,
} = require("./service.controllers");

const router = Router();

router.get("/service", getServices);
router.get("/service/:serviceId", getService);
router.post("/service/getByIds", getServicesById);
router.post("/service", createService);
router.patch("/service/save/sortedService", saveSortedService);
router.patch("/service/delete/all", deleteAllServices);
router.patch("/service/delete/:serviceId", deleteService);
router.patch("/service/:serviceId", updateService);

module.exports = router;
