const express =require('express')
const router = express.Router()
const auth=require('../middlewear/authtoken')
const{createStore,getStores,getStoresById,deleteStores,updateStores} =require('../controller/storeController')
//create store
//POST
router.post('/',auth,createStore)
//get all store
//GET
router.get('/',auth,getStores)
//get store by id
//GET
router.get('/:id',auth,getStoresById)
//update store
//PUT
router.put('/:id',auth,updateStores)
//delete store
//DELETE
router.delete('/:id',auth,deleteStores)


module.exports=router;