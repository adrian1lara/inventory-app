const Category = require('../models/category');
const asyncHanlder = require('express-async-handler');

exports.category_list = asyncHanlder(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();
  res.render('category_list', {
    title: "Category List",
    category_list: allCategories,
  });
});
