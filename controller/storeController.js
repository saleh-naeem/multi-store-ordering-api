const pool= require('../config/db')
const asyncHandler =require('express-async-handler')
//create store
const createStore=asyncHandler(async(req,res)=>{
const{name, description, phone, email, address, image_url, is_open}=req.body;
//check if the email exists
const isemailExists=await pool.query("select EXISTS(select 1 FROM stores where email=$1)",
[email])
if (isemailExists.rows[0].exists) {
   return res.status(400).json("the email already exists")
}
//check if the name exists
const isnameExists=await pool.query("select EXISTS(select 1 FROM stores where name=$1 )",
[name])
if (isnameExists.rows[0].exists) {
    return res.status(400).json("the name already exists")
}
//check if the phone  exists
const isphoneExists=await pool.query("select EXISTS(select 1 FROM stores where phone=$1)",
[phone])
if (isphoneExists.rows[0].exists) {
   return res.status(400).json("the phone already exists")
}
//the query
const r= await pool.query(
`INSERT INTO stores(owner_id, name, description, phone, email, address, image_url, is_open)
values ($1,$2,$3,$4,$5,$6,$7,$8)RETURNING *;`,
[ req.user.id,name, description, phone, email, address, image_url, is_open])

res.status(201).json(r.rows[0]);
})
// get all stores
const getStores=asyncHandler(async(req,res)=>{
    const r= await pool.query("select * from stores;")
    res.status(200).json(r.rows)
})
//update store info
const updateStores=asyncHandler(async(req,res)=>{    
    //check field
    const fields=["name", "description", "phone", "email", "address", "image_url", "is_open"]
    if (!fields.includes(req.body.dataname)) {
        return res.status(400).json(`dataname must be one of ${fields}` )
    }
    const r = await pool.query(`update stores
        set  ${req.body.dataname}=$1 
        where id =$2 and owner_id=$3 RETURNING *;
        `,[req.body.datavalue,req.params.id,req.user.id] )
        if (r.rows.length==0) {
         return res.status(404).json("the store is not exists check the id ")
    }
          res.status(200).json(r.rows[0])
})
//delete store 
const deleteStores=asyncHandler(async(req,res)=>{
  const r =await pool.query(`delete from stores where id =$1 And owner_id=$2 RETURNING *`,[req.params.id,req.user.id])
    if (r.rows.length==0) {
         return res.status(404).json("the store is not exists check the id ")
    }
     return res.status(204).send()
})
// get store by id
const getStoresById=asyncHandler(async(req,res)=>{
     // check if id exists
    const checkId= await pool.query("select exists(select 1 from stores where id =$1) ",[req.params.id])
    if (!checkId.rows[0].exists) {
        return res.status(404).json("the store is not exists check the id ")
    }
    const r= await pool.query("select * from stores where id=$1;",[req.params.id])
    res.status(200).json(r.rows[0])
})

module.exports={createStore,getStores,getStoresById,deleteStores,updateStores}