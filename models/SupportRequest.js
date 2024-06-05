const { Schema, model } = require("mongoose");

const supportRequestSchema = new Schema(
  {
    name: {
      type: String
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phone_number: {
      type: String,
      required: true
    },
    ip_address: {
      type: String
    },
    status: {
      type: String,
      enum: ['RESOLVED', 'UNRESOLVED', 'DELETED']
    },
    message: {
      type: String
    }
  },
  {
    timestamps: true,
    strict: false
  }
);

module.exports = model("SupportRequest", supportRequestSchema);
