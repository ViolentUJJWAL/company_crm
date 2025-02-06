const Company = require("../models/company.model");
const Employee = require("../models/employee.model");
const User = require("../models/user.model");
const crypto = require("crypto");
const sendEmail = require("../utils/sendMail");


// ✅ Super Admin Registration
exports.registerSuperAdmin = async (req, res) => {
    try {
        const { name, email, phoneNo, password, supreAdmincreatePassword } = req.body;

        // 🔸 Validation: Check required fields
        if (!name || !email || !phoneNo || !password || supreAdmincreatePassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 🔸 Check Super Admin Create Password
        if (supreAdmincreatePassword !== process.env.SUPERADMINPASSWORD) {
            return res.status(400).json({ message: "Super Admin Create Password Invalid" })
        }

        // 🔸 Check if email or phone already exists
        const existingUser = await User.findOne({ $or: [{ email }, { phoneNo }] });
        if (existingUser) return res.status(400).json({ message: "Email or Phone already exists" });


        // 🔸 Create Super Admin User
        const newSuperAdmin = new User({
            name,
            email,
            phoneNo,
            password,
            role: "SuperAdmin",
        });

        await newSuperAdmin.save();

        res.status(201).json({ message: "SuperAdmin registered successfully" });
    } catch (error) {
        console.error("SuperAdmin Registration Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Company Registration
exports.registerCompany = async (req, res) => {
    try {
        const { name, companyName, email, companyEmail, phoneNo, companyPhoneNo, password, industry, address } = req.body;

        // 🔸 Validation: Check required fields
        if (!name || !companyName || !email || companyEmail || !phoneNo || companyPhoneNo || !password || !industry || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 🔸 Check if email or phone already exists
        const existingUser = await User.findOne({ $or: [{ email }, { phoneNo }] });
        if (existingUser) return res.status(400).json({ message: "Email or Phone already exists" });
        const existingCompany = await User.findOne({ $or: [{ email: companyEmail }, { phoneNo: companyPhoneNo }] });
        if (existingCompany) return res.status(400).json({ message: "Email or Phone already exists" });

        const file = req.file;
        if (!file) return res.status(400).json({ nessage: "No image provided." });

        const uploadResponse = await uploadOnCloudinary(file.path);
        if (!uploadResponse) return res.status(500).json({ message: "Image upload failed." });

        const image = {
            url: uploadResponse.url,
            public_id: uploadResponse.public_id,
        }

        // 🔸 Create User (Company Owner)
        const newUser = new User({
            name,
            email,
            phoneNo,
            password,
            role: "CompanyAdmin",
        });

        await newUser.save();

        // 🔸 Create Company
        const newCompany = new Company({
            name: companyName,
            phoneNo: companyPhoneNo,
            email: companyEmail,
            industry,
            image,
            address,
            owner: newUser._id,
        });

        await newCompany.save();

        // 🔸 Update User to include Company ID
        newUser.company = newCompany._id;
        await newUser.save();

        res.status(201).json({ message: "Company registered successfully" });
    } catch (error) {
        console.error("Company Registration Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Employee Registration
exports.registerEmployee = async (req, res) => {
    try {
        const { name, email, phoneNo, password, companyId, address, designation } = req.body;

        // 🔸 Validation: Check required fields
        if (!name || !email || !phoneNo || !password || !companyId || !address || !designation) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 🔸 Check if email or phone already exists
        const existingUser = await User.findOne({ $or: [{ email }, { phoneNo }] });
        if (existingUser) return res.status(400).json({ message: "Email or Phone already exists" });

        // 🔸 Find the company
        const company = await Company.findById(companyId);
        if (!company) return res.status(404).json({ message: "Company not found" });
        if (!company.isActive) return res.status(403).json({ message: "Company is inactive" });

        const file = req.file;
        if (!file) return res.status(400).json({ nessage: "No image provided." });

        const uploadResponse = await uploadOnCloudinary(file.path);
        if (!uploadResponse) return res.status(500).json({ message: "Image upload failed." });

        const image = {
            url: uploadResponse.url,
            public_id: uploadResponse.public_id,
        }

        // 🔸 Create User
        const newUser = new User({
            name,
            email,
            phoneNo,
            password,
            company: companyId,
        });

        await newUser.save();

        // 🔸 Create Employee Profile
        const newEmployee = new Employee({
            user: newUser._id,
            image,
            address,
            designation,
            company: companyId,
        });

        await newEmployee.save();

        res.status(201).json({ message: "Employee registered successfully, wait for you verification", token });
    } catch (error) {
        console.error("Employee Registration Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        if (user.role === "Employee" || user.role === "CompanyAdmin") {
            const company = await Company.findById(user.company)
            if (!company.isActive) return res.status(200).json({ message: "Company is inactive. Access denied." });
            if (user.role === "Employee") {
                const employee = await Employee.findOne({ user })
                if (!employee.isActive) return res.status(200).json({ message: "Employee is inactive. Access denied." });
                if (employee.verify !== "Verify") return res.status(200).json({ message: "Employee is not Verify. Access denied.", status: employee.verify });
            }
        }

        const token = user.generateToken();

        res.cookie("token", token, {
            httpOnly: true,       // Prevents client-side access
            // secure: process.env.NODE_ENV === "production", // Secure in production
            sameSite: "Strict",   // Prevents CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiration
        });

        return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error", error });
    }
};

exports.logout = async (req, res) => {

    try {

        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "No token provided" });

        // Store the token in the blocked list
        await BlockedToken.create({ token });

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
        });
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error", error });
    }

};

exports.getProfile = async (req, res) => {
    try {
        // ["SuperAdmin", "CompanyAdmin", "Employee"]
        if (req.user.role === "SuperAdmin") {
            return res.status(200).json({ user: req.user });
        } else if (req.user.role === "CompanyAdmin") {
            const company = await Company.findById(req.user.company).populate("owner")
            return res.status(200).json({ user: company });
        } else if (req.user.role === "Employee") {
            const employee = await Employee.findOne({ user: req.user._id })
                .populate("user") // Populate 'user'
                .populate("company", "name");   // Populate 'company' and select only 'name'

            return res.status(200).json({ user: employee });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error", error });
    }
}


// ✅ Forgot Password - Generate Reset Token
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // 🔸 Validate email
        if (!email) return res.status(400).json({ message: "Email is required" });

        // 🔸 Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.role === "Employee" || user.role === "CompanyAdmin") {
            const company = await Company.findById(user.company)
            if (!company.isActive) return res.status(200).json({ message: "Company is inactive. Access denied." });
            if (user.role === "Employee") {
                const employee = await Employee.findOne({ user })
                if (!employee.isActive) return res.status(200).json({ message: "Employee is inactive. Access denied." });
                if (employee.verify !== "Verify") return res.status(200).json({ message: "Employee is not Verify. Access denied.", status: employee.verify });
            }
        }

        // 🔸 Generate Reset Token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const tokenExpire = Date.now() + 15 * 60 * 1000; // Expires in 15 minutes

        user.forgotPassword.token = resetToken;
        user.forgotPassword.tokenExpire = tokenExpire;
        await user.save();

        // 🔸 Send Email with Reset Link
        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        const message = `You requested a password reset. Click on the link below to reset your password:\n\n ${resetUrl}\n\nThis link will expire in 15 minutes.`;

        await sendEmail(user.email, "Password Reset Request", message);

        return res.status(200).json({ message: "Password reset link sent to email" });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        return res.status(500).json({ message: "Server error", error });
    }
};

exports.checkToken = async (req, res) => {
    try {
        const { token } = req.body;

        // 🔸 Validate Inputs
        if (!token) return res.status(400).json({ message: "Token are required" });

        // 🔸 Find User by Token
        const user = await User.findOne({ "forgotPassword.token": token, "forgotPassword.tokenExpire": { $gt: Date.now() } });
        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        return res.status(200).json({ message: "Forgot Password token is active now" });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        return res.status(500).json({ message: "Server error", error });
    }
}

// ✅ Reset Password
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // 🔸 Validate Inputs
        if (!token || !newPassword) return res.status(400).json({ message: "Token and new password are required" });

        // 🔸 Find User by Token
        const user = await User.findOne({ "forgotPassword.token": token, "forgotPassword.tokenExpire": { $gt: Date.now() } });
        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        // 🔸 Update Password & Clear Token
        user.password = newPassword;
        user.forgotPassword = { token: null, tokenExpire: null };
        await user.save();

        return res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.error("Reset Password Error:", error);
        return res.status(500).json({ message: "Server error", error });
    }
};