const pool = require('../config/db');
const asyncHandler = require('express-async-handler');


// create item
const createItem = asyncHandler(async (req, res) => {
  
const{
store_id, 
name,
description,
price,
image_url,
is_available}=req.body


const isOwner= await pool.query("select exists(select 1 from stores where owner_id =$1 and id=$2)",
[req.user.id,store_id])
if (isOwner.rows[0].exists){
  const item= await pool.query(
  `insert into items (store_id,name,description,price,image_url,is_available)
  values ($1,$2,$3,$4,$5,$6)
  returning *;
  `,[store_id,name,description,price,image_url,is_available])
  return res.status(201).json(item.rows[0])
}
res.status(403).json("you are not the owner")

});


// get all items for one store
const getItemsByStore = asyncHandler(async (req, res) => {
const item= await pool.query("select * from items where store_id=$1",[req.params.storeId])
return res.status(200).json(item.rows)
});


// get item by id
const getItemById = asyncHandler(async (req, res) => {
const item= await pool.query("select * from items where id=$1",[req.params.id])

if (item.rows.length === 0) {
    return res.status(404).json("item not found");
}
return res.status(200).json(item.rows[0])
});


// update item
const updateItem = asyncHandler(async (req, res) => {
  const{store_id,field,value}=req.body
  const fields=["name","description","price","image_url","is_available"]
  if(!fields.includes(field)){return res.status(400).json(` filed can be one of ${fields}`)}
  const isOwner= await pool.query("select exists(select 1 from stores where owner_id =$1 and id=$2)",
[req.user.id,store_id])
if (isOwner.rows[0].exists){
const item = await pool.query(
  `update items
  set  ${field}=$1
  where store_id =$2 and id =$3
 returning *;
  `,[value,store_id,req.params.id])
    if (item.rows.length === 0) {
    return res.status(404).json("item not found in this store");
  }
  return res.status(200).json(item.rows[0])
}
 res.status(403).json("you are not the owner")

});


// delete item
const deleteItem = asyncHandler(async (req, res) => {
  const{store_id}=req.body
 const isOwner= await pool.query("select exists(select 1 from stores where owner_id =$1 and id=$2)",
[req.user.id,store_id])

  
if (isOwner.rows[0].exists){
  const item = await pool.query(
    `delete from items
    where id=$1 and store_id=$2 
    returning *;
    `,[req.params.id,store_id])
  if (item.rows.length === 0) {
      return res.status(404).json("item not found");
  }
return res.status(204).send()
}
 res.status(403).json("you are not the owner")

});


module.exports = {
  createItem,
  getItemsByStore,
  getItemById,
  updateItem,
  deleteItem
};