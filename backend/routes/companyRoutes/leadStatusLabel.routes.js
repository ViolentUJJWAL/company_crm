const express = require("express");
const { addLeadStatusLabel, getAllLeadStatusLabel, updateLeadStatusLabel } = require("../../controllers/companyControllers/leadStatusLabel.controller");
const checkRole = require("../../middleware/checkRole");

const router = express.Router();

router.post("/",checkRole("CompanyAdmin"), addLeadStatusLabel)
router.get("/", checkRole("SuperAdmin", "CompanyAdmin", "Employee"), getAllLeadStatusLabel)
router.put("/:leadStatusLabelId",checkRole("CompanyAdmin"), updateLeadStatusLabel)

module.exports = router;
