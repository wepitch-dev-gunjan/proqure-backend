const { Schema, model } = require("mongoose");

const adminSchema = new Schema(
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
    password: {
      type: String,
      required: true
    },
    phone_number: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['INACTIVE', 'ACTIVE', 'DELETED']
    },
    profile_picture: {
      type: String,
      default: ""
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

module.exports = model("Admin", adminSchema);
