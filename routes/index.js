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



// items routes 
router.get('/items', items_controller.item_list);

module.exports = router;
