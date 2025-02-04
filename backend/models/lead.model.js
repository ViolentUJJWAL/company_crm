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
      name: {
        type: String,
        required: [true, 'Contact name is required'],
        trim: true,
      },
      phoneNo: {
        type: String,
        required: [true, 'Contact phone number is required'],
        match: [/^\d{10,15}$/, 'Phone number must be between 10 to 15 digits'],
      },
      email: {
        type: String,
        required: [true, 'Contact email is required'],
        trim: true,
        lowercase: true,
      },
      address: {
        country: { type: String, required: [true, 'Country is required'] },
        state: { type: String, required: [true, 'State is required'] },
        city: { type: String, required: [true, 'City is required'] },
        pincode: {
          type: String,
          required: [true, 'Pincode is required'],
          match: [/^\d{4,10}$/, 'Pincode must be between 4 to 10 digits'],
        },
      },
      businessCard: {
        public_id: { type: String, required: [true, 'Business card public_id is required'] },
        url: { type: String, required: [true, 'Business card URL is required'] },
      },
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
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Converted', 'Closed'],
      default: 'New',
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
