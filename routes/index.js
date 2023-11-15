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

// get one category 
router.get('/category/:id', category_controller.category_detail);

// get create a category
router.get('/categories/create', category_controller.category_create_get);

// post request for creating category
router.post('/categories/create', category_controller.genre_create_post);

// items routes 
router.get('/items', items_controller.item_list);

// get create item 
router.get('/item/create', items_controller.item_create_get);

// post request for creating item 
router.post('/item/create', items_controller.item_create_post);


// get one item 
router.get('/item/:id', items_controller.item_detail);

module.exports = router;
