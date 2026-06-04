const express= require('express')
const router=express.Router()
const pool= require('../config/db')
const {getUsers,acceptingStore}= require('../controller/adminController')
const auth =require('../middlewear/authtoken')
const admin =require('../middlewear/admin')

//get all users
router.get('/user',auth,admin,getUsers)
// // get all stores
// router.get('/store',auth,admin,getStores)
//accepting store
router.put('/:id',auth,admin,acceptingStore)
module.exports=router