const express= require('express')
const router=express.Router()
const {register,login}=require('../controller/authController')

//POST
//register
router.post('/register',register );

//login
//post
router.post('/login',login);

module.exports=router;