const express = require('express');
const router = express.Router();

const auth = require('../middlewear/authtoken');
const store = require('../middlewear/store');

const {
  createItem,
  getItemsByStore,
  getItemById,
  updateItem,
  deleteItem
} = require('../controller/itemController');


// create item
// POST /api/item
router.post('/', auth,store, createItem);


// get all items for specific store
// GET /api/item/store/:storeId
router.get('/store/:storeId', auth, getItemsByStore);


// get item by id
// GET /api/item/:id
router.get('/:id', auth, getItemById);


// update item
// PUT /api/item/:id
router.put('/:id', auth,store, updateItem);


// delete item
// DELETE /api/item/:id
router.delete('/:id', auth,store, deleteItem);


module.exports = router;