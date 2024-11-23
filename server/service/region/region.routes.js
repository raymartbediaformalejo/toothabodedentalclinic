const { Router } = require("express");
const {
  getAllRegions,
  getProvincesCities,
  getBrgys,
} = require("./region.controllers.js");

const router = Router();

router.get("/regions", getAllRegions);
router.get("/regions/provinces-cities/:regionID", getProvincesCities);
router.get("/regions/brgys/:provinceCityID", getBrgys);

module.exports = router;
