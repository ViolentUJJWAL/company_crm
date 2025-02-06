const Company = require("../models/company.model");
const Employee = require("../models/employee.model");


const checkActiveStatus = async (req, res, next) => {
  try {
    const user = req.user
    if (user.role === "Employee" || user.role === "CompanyAdmin") {
      const company = await Company.findById(user.company)
      if (!company.isActive) return res.status(200).json({ message: "Company is inactive. Access denied." });
      if (user.role === "Employee") {
        const employee = await Employee.findOne({ user })
        if (!employee.isActive) return res.status(200).json({ message: "Employee is inactive. Access denied." });
        if (employee.verify !== "Verify") return res.status(200).json({ message: "Employee is not Verify. Access denied.", status: employee.verify });
      }
    }
    next();
  } catch (error) {
    console.error("Company Status Check Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = checkActiveStatus;
