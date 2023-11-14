const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number },
  stock: { type: Number }
});

// url for category selected
ItemSchema.virtual('url').get(function() {
  return `/item/${this._id}`;
})

module.exports = mongoose.model('Items', ItemSchema);
