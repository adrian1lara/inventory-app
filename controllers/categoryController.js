const Category = require('../models/category');
const asyncHanlder = require('express-async-handler');
const { body, validationResult } = require('express-validator');
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

// category create on get 
exports.category_create_get = (req, res, next) => {
  res.render('category_form', { title: 'Create Category' });
};

// hanlde category create on post
exports.genre_create_post = [

  body('name', 'Category name must contain min 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // after validation process request
  asyncHanlder(async (req, res, next) => {

    const errors = validationResult(req);

    const category = new Category({ name: req.body.name, description: req.body.description });

    if (!errors.isEmpty()) {
      res.render('category_form', {
        title: 'Create category',
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      const categoryExists = await Category.findOne({ name: req.body.name }).exec();
      if (categoryExists) {
        res.redirect(categoryExists.url);
      } else {
        await category.save();

        res.redirect(category.url)
      }
    }
  })
]




