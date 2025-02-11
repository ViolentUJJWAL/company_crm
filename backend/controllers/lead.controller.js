const Contacts = require("../models/contact.model");
const Employee = require("../models/employee.model");
const Lead = require("../models/Lead");
const LeadFor = require("../models/leadFor.model");
const LeadSource = require("../models/leadSource.model");
const LeadStatusLabel = require("../models/leadStatusLabel.model");

// ✅ Create a Lead
exports.createLead = async (req, res) => {
    try {
        const { leadForId, leadSourceId, priority, contactId, reference, statusId, remark, assignedTo } = req.body;

        if (!leadForId || !leadSourceId || !priority || !contactId || !statusId || !assignedTo) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (!['Low', 'Medium', 'High'].includes(priority)) return res.status(400).json({ message: "Priority must be 'Low', 'Medium', or 'High'" })

        const company = req.user.company

        if (!await LeadFor.findOne({ _id: leadForId, company, isActive: true })) return res.status(404).json({ message: "Lead For not found" });
        if (!await LeadSource.findOne({ _id: leadSourceId, company, isActive: true })) return res.status(404).json({ message: "Lead Source not found" });
        if (!await LeadStatusLabel.findOne({ _id: statusId, company, isActive: true })) return res.status(404).json({ message: "Lead Status not found" });
        if (!await Contacts.findOne({ _id: contactId, company })) return res.status(404).json({ message: "Client Contacts not found" });
        if (!await Employee.findOne({ _id: assignedTo, company, isActive: true })) return res.status(404).json({ message: "Assigned To Employee not found" });

        const newLead = new Lead({
            for: leadForId,
            source: leadSourceId,
            priority,
            contact: contactId,
            reference,
            status: statusId,
            remark,
            assignedTo,
            company,
        });

        const savedLead = await newLead.save();
        return res.status(201).json({ message: "Lead created successfully", data: savedLead });

    } catch (error) {
        console.error("Error creating lead:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// ✅ Update a Lead
exports.updateLead = async (req, res) => {
    try {
        const { id } = req.params;
        const { leadForId, leadSourceId, priority, contactId, reference, statusId, remark, assignedTo } = req.body;
        const company = req.user.company;

        // 🔹 Check if lead exists
        const lead = await Lead.findOne({ _id: id, company });
        if (!lead) return res.status(404).json({ message: "Lead not found" });

        // 🔹 Validate Priority
        if (priority && !["Low", "Medium", "High"].includes(priority)) {
            return res.status(400).json({ message: "Priority must be 'Low', 'Medium', or 'High'" });
        }

        // 🔹 Validate References if Provided
        if (leadForId && !(await LeadFor.findOne({ _id: leadForId, company, isActive: true }))) {
            return res.status(404).json({ message: "Lead For not found" });
        }
        if (leadSourceId && !(await LeadSource.findOne({ _id: leadSourceId, company, isActive: true }))) {
            return res.status(404).json({ message: "Lead Source not found" });
        }
        if (statusId && !(await LeadStatusLabel.findOne({ _id: statusId, company, isActive: true }))) {
            return res.status(404).json({ message: "Lead Status not found" });
        }
        if (contactId && !(await Contacts.findOne({ _id: contactId, company }))) {
            return res.status(404).json({ message: "Client Contact not found" });
        }
        if (assignedTo && !(await Employee.findOne({ _id: assignedTo, company, isActive: true }))) {
            return res.status(404).json({ message: "Assigned Employee not found" });
        }

        // 🔹 Update Lead Data
        lead.for = leadForId || lead.for;
        lead.source = leadSourceId || lead.source;
        lead.priority = priority || lead.priority;
        lead.contact = contactId || lead.contact;
        lead.reference = reference || lead.reference;
        lead.status = statusId || lead.status;
        lead.remark = remark || lead.remark;
        lead.assignedTo = assignedTo || lead.assignedTo;

        await lead.save();

        return res.status(200).json({ message: "Lead updated successfully", data: lead });

    } catch (error) {
        console.error("Error updating lead:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// ✅ Get All Leads (with optional filters)
exports.getLeads = async (req, res) => {
    try {
        const { search, priority, status, assignedTo, page = 1, limit = 10 } = req.query;
        const company = req.user.company; // Get the company ID from the authenticated user

        let filter = { company }; // Ensure filtering by company

        // 🔹 Apply Filters
        if (priority) {
            if (!["Low", "Medium", "High"].includes(priority)) {
                return res.status(400).json({ message: "Invalid priority value" });
            }
            filter.priority = priority;
        }
        if (status) filter.status = status;
        if (assignedTo) filter.assignedTo = assignedTo;

        // 🔹 Search by Contact Name or Reference Name
        if (search) {
            const contacts = await Contacts.find({
                name: { $regex: search, $options: "i" }, // Case-insensitive search
                company,
            }).select("_id");

            filter.$or = [
                { contact: { $in: contacts.map((c) => c._id) } },
                { "reference.name": { $regex: search, $options: "i" } },
            ];
        }

        // 🔹 Pagination
        const skip = (page - 1) * limit;
        const leads = await Lead.find(filter)
            .populate("for source contact status assignedTo")
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        const totalLeads = await Lead.countDocuments(filter);

        return res.status(200).json({
            message: "Leads retrieved successfully",
            total: totalLeads,
            page: Number(page),
            totalPages: Math.ceil(totalLeads / limit),
            data: leads,
        });

    } catch (error) {
        console.error("Error fetching leads:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// ✅ Get Lead by ID
exports.getLeadById = async (req, res) => {
    try {
        const { id } = req.params;

        const lead = await Lead.findById(id).populate("contact status assignedTo source for");
        if (!lead) return res.status(404).json({ message: "Lead not found" });

        if (String(lead.company) !== String(req.user.company)) {
            return res.status(403).json({ message: "Unauthorized to view this lead" });
        }

        return res.status(200).json({ message: "Lead retrieved successfully", data: lead });

    } catch (error) {
        console.error("Error retrieving lead:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// ✅ Change Lead Status
exports.changeLeadStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { statusId } = req.body;
        const company = req.user.company

        if (!statusId) return res.status(400).json({ message: "Status is required" });

        const fetchStatus = await LeadStatusLabel.findOne({ _id: statusId, company })
        if (!fetchStatus) return res.status(404).json({ message: "Lead Status not found" });

        const lead = await await Lead.findOne({ _id: id, company });
        if (!lead) return res.status(404).json({ message: "Lead not found" });


        lead.status = fetchStatus._id;
        await lead.save();

        return res.status(200).json({ message: "Lead status updated successfully", data: lead });

    } catch (error) {
        console.error("Error changing lead status:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.addFollowUp = async (req, res) => {
    try {
        const { id } = req.params; // Lead ID from URL
        const { conclusion } = req.body;

        if (!conclusion) return res.status(400).json({ message: "Follow-up conclusion is required" });

        const lead = await Lead.findOne({ _id: id, company: req.user.company });
        if (!lead) return res.status(404).json({ message: "Lead not found" });

        // Ensure user has access to modify this lead
        if (String(lead.company) !== String(req.user.company)) {
            return res.status(403).json({ message: "Unauthorized to add follow-up to this lead" });
        }

        // Auto-generate sequence number
        const sequence = lead.followUps.length ? lead.followUps.length + 1 : 1;

        // Add follow-up
        lead.followUps.push({ sequence, conclusion });
        await lead.save();

        return res.status(200).json({ message: "Follow-up added successfully", data: lead });

    } catch (error) {
        console.error("Error adding follow-up:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.updateFollowUp = async (req, res) => {
    try {
        const { id, followUpId } = req.params; // Lead ID & Follow-up ID from URL
        const { conclusion } = req.body;

        if (!conclusion) return res.status(400).json({ message: "Follow-up conclusion is required" });

        const lead = await Lead.findOne({ _id: id, company: req.user.company });
        if (!lead) return res.status(404).json({ message: "Lead not found" });

        // Ensure user has access to modify this lead
        if (String(lead.company) !== String(req.user.company)) {
            return res.status(403).json({ message: "Unauthorized to modify this lead" });
        }

        // 🔄 **Find & Update Existing Follow-up**
        const followUp = lead.followUps.find(f => String(f._id) === followUpId);
        if (!followUp) return res.status(404).json({ message: "Follow-up not found" });

        followUp.conclusion = conclusion;

        await lead.save();
        return res.status(200).json({ message: "Follow-up updated successfully", data: lead });

    } catch (error) {
        console.error("Error updating follow-up:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
