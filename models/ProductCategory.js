const { Schema, model } = require('mongoose');

// Define the schema
const productCategorySchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  banner_image: { type: String },
  status: { type: String, required: true, enum: ['PUBLISHED', 'UNPUBLISHED', 'DELETED'] },
  description: { type: String }
}, {
  timestamps: true,
  strict: false
});

// Create the model from the schema
module.exports = model('ProductCategory', productCategorySchema);


