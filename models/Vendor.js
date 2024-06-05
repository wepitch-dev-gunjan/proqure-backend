const { Schema, model } = require("mongoose");

const vendorSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true
    },
    last_name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    username: {
      type: String,
      required: true
    },
    company_name: {
      type: String
    },
    company_location: {
      type: String
    },
    password: {
      type: String,
      required: true
    },
    phone_number: {
      type: String,
      required: true
    },
    profile_picture: {
      type: String
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'REJECTED', 'DELETED']
    },
    last_activity: {
      type: Date,
      default: new Date()
    },
    gst_number: {
      type: String,
      required: true
    },
    reset_password_token: {
      type: String,
      default: ""
    },
    reset_password_expires: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    strict: false
  }
);

module.exports = model("Vendor", vendorSchema);