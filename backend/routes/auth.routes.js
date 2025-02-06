const express = require("express");
const { loginUser, registerEmployee, registerCompany, logout, getProfile, registerSuperAdmin } = require("../controllers/auth.controller");
const checkActiveStatus = require("../middleware/checkActiveStatus");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register/company", registerCompany);
router.post("/register/employee", registerEmployee);
router.post("/register/super-admin", registerSuperAdmin); // for postman
router.post("/login", loginUser);
router.get("/logout", authMiddleware, checkActiveStatus, logout);
router.get("/profile", authMiddleware, checkActiveStatus, getProfile);

module.exports = router;
