const { Schema, model } = require('mongoose');

// Define the schema
const pinProjectSchema = new Schema({
  name: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: { type: [Schema.Types.ObjectId], ref: 'Product' },
  status: { type: String, required: true, enum: ['CONTACTED', 'NOT_CONTACTED', 'FULLFILLED'], default: 'NOT_CONTACTED' },
  location: { type: String }
}, {
  timestamps: true,
  strict: false
});

// Create the model from the schema
module.exports = model('PinProject', pinProjectSchema);


