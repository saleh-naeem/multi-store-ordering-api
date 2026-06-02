const express= require('express')
const router=express.Router()
const pool= require('../config/db')
const {createCustomer,updateCustomer}= require('../controller/customerController')
const auth =require('../middlewear/authtoken')

//POST
//create customer
// api/store/customer
router.post('/',auth,createCustomer)

//PUT
//update customer
// api/store/customer
router.put('/',auth,updateCustomer)
module.exports=router;