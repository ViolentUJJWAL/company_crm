const express = require("express");
const { getCompanies } = require("../controllers/company.controller");

const router = express.Router();

router.get("/", getCompanies)


module.exports = router;
