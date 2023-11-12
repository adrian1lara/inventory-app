const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number },
  stock: { type: Number },
  url: { type: String }
})

module.exports = mongoose.model('Items', ItemSchema);
