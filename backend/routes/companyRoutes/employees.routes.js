const express = require("express");
// const authMiddleware = require("../../middleware/authMiddleware");
// const checkActiveStatus = require("../../middleware/checkActiveStatus");
// const checkRole = require("../../middleware/checkRole");
const { getAllEmployees, verifyEmployee, getVerifiedEmployees, getUnverifiedEmployees, getEmployeeById } = require("../../controllers/companyControllers/employee.controller");


const router = express.Router();

// company employee
// router.get("/all", authMiddleware, checkActiveStatus, checkRole("CompanyAdmin"), getAllEmployees)
// router.post("/verification", authMiddleware, checkActiveStatus, checkRole("CompanyAdmin"), verifyEmployee)
// router.get("/verify", authMiddleware, checkActiveStatus, checkRole("CompanyAdmin"), getVerifiedEmployees)
// router.get("/unverify", authMiddleware, checkActiveStatus, checkRole("CompanyAdmin"), getUnverifiedEmployees)
// router.get("/profile/:employeeId", authMiddleware, checkActiveStatus, checkRole("CompanyAdmin"), getEmployeeById)

router.get("/all", getAllEmployees)
router.post("/verification", verifyEmployee)
router.get("/verify", getVerifiedEmployees)
router.get("/unverify", getUnverifiedEmployees)
router.get("/profile/:employeeId", getEmployeeById)


module.exports = router;
