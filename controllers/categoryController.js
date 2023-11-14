const Category = require('../models/category');
const asyncHanlder = require('express-async-handler');
const mongoose = require('mongoose')

// list of all catgories
exports.category_list = asyncHanlder(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();
  res.render('category_list', {
    title: "Category List",
    category_list: allCategories,
  });
});

// detail page for specific category
exports.category_detail = asyncHanlder(async (req, res, next) => {
  try {
    // Validate that req.params.id is a valid ObjectId
    const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidObjectId) {
      // Handle the case where req.params.id is not a valid ObjectId
      return res.status(400).send('Invalid category ID');
    }

    // Fetch the category by its ID
    const oneCategory = await Category.findById(req.params.id).exec();

    // Check if the category was found
    if (!oneCategory) {
      return res.status(404).send('Category not found');
    }

    // Render the view with category details
    res.render('category_detail', {
      title: oneCategory.name, // Assuming name is a property of the category
      category_detail: oneCategory,
    });
  } catch (err) {
    // Handle any other errors that may occur during execution
    return next(err);
  }
});
