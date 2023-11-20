const Items = require('../models/items');
const Category = require('../models/category');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');


// display list of items
exports.item_list = asyncHandler(async (req, res, next) => {
  try {
    const allItems = await Items.find();
    res.render('item_list', {
      title: 'Item list',
      item_list: allItems
    });
  } catch (err) {
    // Pass the error to the next middleware
    console.error(err)
    next(err);
  }
});


// detail page for item selected
exports.item_detail = asyncHandler(async (req, res, next) => {
  try {
    const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidObjectId) {
      return res.status(400).send('Invalid item ID');
    }

    const oneItem = await Items.findById(req.params.id).exec();

    if (!oneItem) {
      return res.status(404).send('Item not found');
    }

    const category = await Category.findById(oneItem.category).exec();

    res.render('item_detail', {
      title: oneItem.name,
      item_detail: oneItem,
      categoryName: category,
    });
  } catch (error) {
    return next(error);
  }
});

// get create form for item 
exports.item_create_get = asyncHandler(async (req, res, next) => {

  const allCategories = await Category.find().exec();

  const item = {
    name: '',
    description: '',
    price: '',
    stock: '',
  }

  res.render('item_form', {
    title: 'Create Item',
    categories: allCategories,
    item: item,
  });
});


// handle item create on post
exports.item_create_post = [

  // validate and sanitize fields
  body('name', 'Name must not be empty.')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('description', 'item need a description')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('category')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('price')
    .toFloat()
    .escape(),
  body('stock')
    .toInt()
    .escape(),

  asyncHandler(async (req, res, next) => {

    const errors = validationResult(req);

    const item = new Items({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
    });

    if (!errors.isEmpty()) {

      const allCategories = await Category.find().exec();

      res.render('item_form', {
        title: 'Create item',
        categories: allCategories,
        item: item,
        errors: errors.array(),
      });
    } else {

      await item.save();
      res.redirect(item.url);
    }
  }),
];


//Display item delete
exports.item_delete_get = asyncHandler(async (req, res, next) => {

  const item = await Items.findById(req.params.id).exec();

  if (item === null) {
    res.redirect('/items')
  }

  res.render('item_delete', {
    title: 'Item delete',
    item: item,
  });
});


// handle item delete on post
exports.item_delete_post = asyncHandler(async (req, res, next) => {

  try {
    // No need to revalidate the existence of the item; it was done in the GET request
    // Use await to get the result of the asynchronous operation
    await Items.findByIdAndDelete(req.body.itemid);

    // Redirect after successful deletion
    return res.redirect('/items');
  } catch (error) {
    // Handle errors appropriately
    return next(error);
  }
})


// display item update on GET
exports.item_update_get = asyncHandler(async (req, res, next) => {

  const [item, allCategories] = await Promise.all([
    Items.findById(req.params.id).populate('category').exec(),
    Category.find().exec(),
  ])

  if (item === null) {
    // no results
    const err = new Error('Item not found');
    err.status = 404;
    return next(err);
  }


  res.render('item_form', {
    title: 'Update item',
    categories: allCategories,
    item: item,
  });
});


// handle item update on POST 
exports.item_update_post = [
  // validate and sanitize fields
  body('name', 'Name must not be empty.')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('description', 'item need a description')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('category')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('price')
    .toFloat()
    .escape(),
  body('stock')
    .toInt()
    .escape(),

  asyncHandler(async (req, res, next) => {

    const errors = validationResult(req);

    const item = new Items({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {

      const allCategories = await Category.find().exec();

      res.render('item_form', {
        title: 'Update item',
        categories: allCategories,
        item: item,
        errors: errors.array(),
      });
      return;
    } else {
      const updateItem = await Items.findByIdAndUpdate(req.params.id, item, {});

      res.redirect(updateItem.url);
    }


  })
]
