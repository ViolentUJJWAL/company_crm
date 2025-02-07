const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRole");
const { verifyCompany, getVerifiedCompanies, getUnverifiedCompanies, toggleCompanyStatus } = require("../controllers/superAdmin.controller");

const router = express.Router();

router.put("/company/verify/:companyId", authMiddleware, checkRole("SuperAdmin"), verifyCompany)
router.get("/company/verify", authMiddleware, checkRole("SuperAdmin"), getVerifiedCompanies)
router.get("/company/unverify", authMiddleware, checkRole("SuperAdmin"), getUnverifiedCompanies)
router.patch("/company/change-status", authMiddleware, checkRole("SuperAdmin"), toggleCompanyStatus)


module.exports = router;
