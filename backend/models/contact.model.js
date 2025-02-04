const mongoose = require('mongoose');

const contactsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, "Email must be unique"],
      trim: true,
      lowercase: true,
    },
    phoneNo: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^\d{10,15}$/, 'Phone number must be between 10 to 15 digits'],
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company reference is required'],
    },
  },
  { timestamps: true }
);

const Contacts = mongoose.model('Contacts', contactsSchema);
module.exports = Contacts;