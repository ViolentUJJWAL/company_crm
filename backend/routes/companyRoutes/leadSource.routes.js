const express = require("express");
const { addLeadSource, updateLeadSource, toggleActiveLeadSource, getAllLeadSource, getActiveLeadSource } = require("../../controllers/companyControllers/leadSource.controller");

const router = express.Router();

router.post("/", addLeadSource)
router.put("/:leadSourceId", updateLeadSource)
router.patch("/:leadSourceId", toggleActiveLeadSource)
router.get("/all", getAllLeadSource)
router.get("/", getActiveLeadSource)


module.exports = router;
