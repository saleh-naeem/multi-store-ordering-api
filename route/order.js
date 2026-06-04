const express= require('express')
const router=express.Router()
const pool= require('../config/db')
const {updateQuantity,getOrderDetails,changeStatus,checkout,getOrderItems,addToCart,removeFromCart}= require('../controller/orderController')
const auth =require('../middlewear/authtoken')
const customer=require('../middlewear/customer')
const store=require('../middlewear/store')
const asyncHandler=require('express-async-handler')

//POST
//add to cart
// api/order
router.post('/',auth,customer,addToCart)

//DELETE
//delete from cart 
// api/order
router.delete('/',auth,customer,removeFromCart)
//GET
//GET cart items
// api/order
router.get('/',auth,getOrderItems)
//PUT
//checkout 
// api/order
router.put('/',auth,customer,checkout)
//accept the order
//put
router.put('/proses/:id',auth,store,changeStatus)
//get order details
//GET
router.get("/details/:id", auth, getOrderDetails);
//update the quantity
//PATCH
router.patch('/quantity/:id',auth,customer,updateQuantity)

module.exports=router;