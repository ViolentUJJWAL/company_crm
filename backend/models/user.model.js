const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
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
      lowercase: true
    },
    phoneNo: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: [true, "Phone number must be unique"],
      match: [/^\d{10,15}$/, 'Phone number must be between 10 to 15 digits'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: ['SuperAdmin', 'CompanyAdmin', 'Employee'],
      default: 'Employee',
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      default: null,
      validate: {
        validator: function (value) {
          return this.role !== 'SuperAdmin' || value === null;
        },
        message: 'SuperAdmin should not have a company assigned',
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
