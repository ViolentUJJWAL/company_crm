const express = require("express");
const { addLeadFor, updateLeadFor, getAllLeadFor, getActiveLeadFor, toggleActiveLeadFor } = require("../../controllers/companyControllers/leadFor.controller");

const router = express.Router();

router.post("/", addLeadFor)
router.put("/:leadForId", updateLeadFor)
router.patch("/:leadForId", toggleActiveLeadFor)
router.get("/all", getAllLeadFor)
router.get("/", getActiveLeadFor)


module.exports = router;
