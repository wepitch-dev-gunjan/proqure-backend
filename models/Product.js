const { Schema, model } = require('mongoose');

// Define the schema
const productSchema = new Schema({
  main_image: { type: String, required: true },
  image_gallery: { type: [String] },
  admin_sku: { type: String, required: true, unique: true },
  vendor_sku: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  origin: { type: String, required: true },
  base_color: { type: String, required: true },
  price_range: { type: String, required: true },
  thickness_in_mm: { type: Number, required: true },
  lot_location: { type: String, required: true },
  height_in_inches: { type: Number, required: true },
  width_in_inches: { type: Number, required: true },
  quantity: { type: Number, required: true },
  total_material: { type: Number, required: true },
  bulk_available: { type: Boolean, required: true, default: true },
  area_of_usage: { type: [String], required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, required: true, enum: ['APPROVED', 'INAPPROVED', 'DELETED'] },
  recommended_usage: { type: String },
  description: { type: String }
}, {
  timestamps: true,
  strict: false
});

// Create the model from the schema
module.exports = model('Product', productSchema);


