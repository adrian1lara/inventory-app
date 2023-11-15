const express = require('express');
const router = express.Router();

// require controllers
const category_controller = require('../controllers/categoryController');
const items_controller = require('../controllers/itemController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Inventory App' });
});



// Category Routes
router.get('/categories', category_controller.category_list);

// get create a category
router.get('/category/create', category_controller.category_create_get);

// post request for creating category
router.post('/category/create', category_controller.category_create_post);

// get update category form
router.get('/category/:id/update', category_controller.category_update_get);

// post request for update category
router.post('/category/:id/update', category_controller.category_update_post);

// get one category 
router.get('/category/:id', category_controller.category_detail);

// Display category delete form on get 
router.get('/category/:id/delete', category_controller.category_delete_get);

// Handle category delete form on POST
router.post('/category/:id/delete', category_controller.category_delete_post);



// items routes 
router.get('/items', items_controller.item_list);

// get create item 
router.get('/item/create', items_controller.item_create_get);

// post request for creating item 
router.post('/item/create', items_controller.item_create_post);

// get update form
router.get('/item/:id/update', items_controller.item_update_get);

// post update form
router.post('/item/:id/update', items_controller.item_update_post);

// get one item 
router.get('/item/:id', items_controller.item_detail);

// get delete form 
router.get('/item/:id/delete', items_controller.item_delete_get);

// handle item delete form on post
router.post('/item/:id/delete', items_controller.item_delete_post);

module.exports = router;
