const Items = require('../models/items');
const Category = require('../models/category');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');


// display list of items
exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Items.find().exec();
  res.render('item_list', {
    title: 'Item list',
    item_list: allItems
  });
});


// detail page for item selected
exports.item_detail = asyncHandler(async (req, res, next) => {
  try {
    const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidObjectId) {
      return res.status(400).send('Invalid item ID');
    }

    const oneItem = await Items.findById(req.params.id).exec();

    if (!oneCategory) {
      return res.status(404).send('Item not found');
    }

    res.render('item_detail', {
      title: oneItem.name,
      item_detail: oneItem
    });
  } catch (error) {
    return next(error);
  }
});
