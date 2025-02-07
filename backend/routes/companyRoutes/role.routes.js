const express = require("express");
const { createRole, getAllRoles, getActiveRoles, getRoleById, updateRole, toggleActiveRole } = require("../../controllers/companyControllers/role.controller");

const router = express.Router();

router.post("/", createRole)
router.get("/all", getAllRoles)
router.get("/active", getActiveRoles)
router.put("/:roleId", updateRole)
router.patch("/:roleId", toggleActiveRole)
router.get("/:roleId", getRoleById)


module.exports = router;
