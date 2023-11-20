const Category = require('../models/category');
const Items = require('../models/items');
const asyncHanlder = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose')

// list of all catgories
exports.category_list = asyncHanlder(async (req, res, next) => {
  try {
    const allCategories = await Category.find();
    res.render('category_list', {
      title: "Category List",
      category_list: allCategories,
    });
  } catch (err) {
    console.error(err)
    next(err)
  }
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

  const category = {
    name: '',
    description: '',
  }

  res.render('category_form', {
    title: 'Create Category',
    category: category,
  });
};

// hanlde category create on post
exports.category_create_post = [

  body('name', 'Category name must contain min 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('description')
    .trim()
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


//Display category delete
exports.category_delete_get = asyncHanlder(async (req, res, next) => {

  const [category, allItemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Items.find({ category: req.params.id }).exec(),
  ]);

  if (category === null) {
    res.redirect('/categories');
  }

  res.render('category_delete', {
    title: 'Delete Category',
    category: category,
    category_items: allItemsInCategory
  });
});


// handle category delete on post
exports.category_delete_post = asyncHanlder(async (req, res, next) => {
  const [category, allItemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Items.find({ category: req.params.id }).exec(),
  ]);

  if (allItemsInCategory.length > 0) {

    res.render('category_delete', {
      title: 'Delete category',
      category: category,
      category_items: allItemsInCategory,
    });
    return;
  } else {

    await Category.findByIdAndDelete(req.body.categoryid);
    res.redirect('/categories');
  }
});



// display category update form on get 
exports.category_update_get = asyncHanlder(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();

  if (category === null) {
    // no results
    const err = new Error('category not found');
    err.status = 400;
    return next(err);
  }

  res.render('category_form', {
    title: 'Update category',
    category: category,
  });
});

// handle category update on POST 
exports.category_update_post = [

  body('name', 'name must not be empty.')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('description')
    .trim()
    .escape(),

  asyncHanlder(async (req, res, next) => {

    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {

      res.render('category_form', {
        title: 'Update Category',
        category: category,
        errors: errors.array()
      });

      return;
    } else {
      const updateCategory = await Category.findByIdAndUpdate(req.params.id, category, {});

      res.redirect(updateCategory.url);
    }
  })
]



