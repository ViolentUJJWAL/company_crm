const express = require("express");
const { getCompanies } = require("../controllers/company.controller");
const authMiddleware = require("../middleware/authMiddleware");
const checkActiveStatus = require("../middleware/checkActiveStatus");
const checkRole = require("../middleware/checkRole");

const router = express.Router();

router.get("/", getCompanies)

// company employee
router.use("/employee", authMiddleware, checkActiveStatus, checkRole("CompanyAdmin"), require("./companyRoutes/employees.routes") )

// company role
router.use("/role", authMiddleware, checkActiveStatus, checkRole("CompanyAdmin"), require("./companyRoutes/role.routes") )

// leadFor
router.use("/lead-for", authMiddleware, checkActiveStatus, checkRole("CompanyAdmin"), require("./companyRoutes/leadFor.routes") )

// leadSource
router.use("/lead-source", authMiddleware, checkActiveStatus, checkRole("CompanyAdmin"), require("./companyRoutes/leadSource.routes") )




module.exports = router;
