const express= require('express')
const router=express.Router()
const pool= require('../config/db')
const {getAddress,getCustomer,createCustomer,updateCustomer}= require('../controller/customerController')
const auth =require('../middlewear/authtoken')
const customer =require('../middlewear/customer')

//POST
//create customer
// api/store/customer
router.post('/',auth,createCustomer)

//PUT
//update customer
// api/store/customer
router.put('/',auth,customer,updateCustomer)

//GET
//get customer profile
// api/store/customer
router.get('/',auth,getCustomer)

//GET
//get customer address
// api/store/customer/address
router.get('/address',auth,getAddress)

module.exports=router;