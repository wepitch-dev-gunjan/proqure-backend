const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    other_email: {
      type: String
    },
    phone_number: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    user_type: {
      type: String
    },
    ip_address: {
      type: String
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'DELETED']
    },
    profile_picture: {
      type: String,
      default: ""
    },
    firm_name: {
      type: String
    },
    firm_address: {
      type: String
    },
    gst_number: {
      type: String
    }
  },
  {
    timestamps: true,
    strict: false
  }
);

module.exports = model("User", userSchema);
