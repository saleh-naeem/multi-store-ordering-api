const pool= require('../config/db')
const asyncHandler =require('express-async-handler')




const getUsers= asyncHandler(async(req,res)=>{
    const user= await pool.query(`select id, name, email, role, created_at from users`)
    res.status(200).json(user.rows)
})



// const getStores= asyncHandler(async(req,res)=>{
//     const store= await pool.query(`select * from stores`)
//     res.status(200).json(store.rows)
// })



const acceptingStore= asyncHandler(async(req,res)=>{
    const store = await pool.query(
        `update stores 
        set status='accepted'
        where id=$1
        returning *
        `,[req.params.id])
        if (store.rows.length === 0) {
  return res.status(404).json("store not found");
}
        res.status(200).json(store.rows[0])
})



module.exports={getUsers,acceptingStore}