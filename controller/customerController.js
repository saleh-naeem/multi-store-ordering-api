const pool= require('../config/db')
const asyncHandler =require('express-async-handler')
// create customer 
const createCustomer= asyncHandler(async(req,res)=>{
    const {phone,title,city,street,building}= req.body;
    const client=await pool.connect()
    try{
    await client.query("begin")
    const customer = await client.query(
    `insert into customers (user_id,phone)
     values ($1,$2)
     RETURNING *;
    `,[req.user.id,phone])

   const address= await client.query(
    `insert into addresses (customer_id,title,city,street,building)
     values ($1,$2,$3,$4,$5)
     RETURNING *;
    `,[customer.rows[0].id,title,city,street,building])
         await client.query("commit")
             res.status(201).json({customer:customer.rows[0],address:address.rows[0]})

}
catch(error){
   await client.query("rollback")
   if (error.code === "23505") {
  return res.status(400).json({
    message: "Customer already exists for this user",
  });
}
  return res.status(500).json({
    message: "Something went wrong",
    error: error.message,
  });

}finally{
    client.release()
}
})


// update customer
const updateCustomer= asyncHandler(async(req,res)=>{
let r;
//check if customer exists
if (r.rows.length === 0) {
  return res.status(404).json({
    message: "Customer or address not found",
  });
}
  //customer query
  if(req.body.field==="phone"){
    const customer = await pool.query(
   `update customers 
    set phone= $1
    where user_id=$2
    RETURNING *;
   `,[req.body.value,req.user.id])
   r= customer;
   }
    //update for address
    // address query 
    else if (fields.includes(req.body.field)) {
        const address = await pool.query(
   `update addresses 
    set ${req.body.field} = $1
    where customer_id=(select id from customers where user_id=$2)
    RETURNING *;
   `,[req.body.value,req.user.id])
   r=address;
    }
    else{
       return res.status(400).json(`field must be one of phone ${fields}`)
    }
    
    res.status(200).json(r.rows[0])
})

module.exports={createCustomer,updateCustomer}