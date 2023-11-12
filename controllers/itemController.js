const Items = require('../models/items');
const Category = require('../models/category');
const asyncHandler = require('express-async-handler');


// display list of items
exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Items.find().exec();
  res.render('item_list', {
    title: 'Item list',
    item_list: allItems
  });
});

