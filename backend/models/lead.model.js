const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    for: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LeadFor',
      required: [true, 'LeadFor reference is required'],
    },
    source: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LeadSource',
      required: [true, 'LeadSource reference is required'],
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    contact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contacts',
      required: [true, 'Lead Contact is required'],
    },
    reference: {
      name: { type: String, trim: true },
      email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [
          /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
          'Please enter a valid email address',
        ],
      },
      phoneNo: {
        type: String,
        match: [/^\d{10,15}$/, 'Phone number must be between 10 to 15 digits'],
      },
    },
    followUps: [
      {
        sequence: { type: Number, required: true },
        date: { type: Date, required: true },
        conclusion: { type: String, trim: true },
        meeting: { type: mongoose.Schema.Types.ObjectId, ref: 'Meeting' },
      },
    ],
    status: {
      // type: String,
      // enum: ['New', 'Contacted', 'Qualified', 'Converted', 'Closed'],
      // default: 'New',
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LeadStatusLabel',
      required: [true, 'Lead Status Label is required'],
    },
    remark: { type: String, trim: true },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Assigned employee reference is required'],
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company reference is required'],
    },
  },
  { timestamps: true }
);

const Lead = mongoose.model('Lead', leadSchema);
module.exports = Lead;
