const pool = require('../config/db');
const asyncHandler = require('express-async-handler');

// add to cart
const addToCart = asyncHandler(async (req, res) => {
  const client = await pool.connect();

  const {
    store_id,
    address_id,
    notes,
    quantity,
    item_id
  } = req.body;

  try {
    await client.query("BEGIN");

    // 1. Get customer id
    const customerResult = await client.query(
      `
      SELECT id 
      FROM customers 
      WHERE user_id = $1
      `,
      [req.user.id]
    );

    if (customerResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Customer not found" });
    }

    const customer_id = customerResult.rows[0].id;

    // 2. Check if cart order already exists
    let orderResult = await client.query(
      `SELECT * 
      FROM orders
      WHERE customer_id = $1
      AND store_id = $2
      AND status = 'cart'
      LIMIT 1
      `,
      [customer_id, store_id]
    );

    let order_id;

    // 3. If cart does not exist, create it
    if (orderResult.rows.length === 0) {
      orderResult = await client.query(
        `INSERT INTO orders 
          (customer_id, store_id, address_id, status, total_price, delivery_fee, notes)
        VALUES 
          ($1, $2, $3, 'cart', 0, 2, $4)
        RETURNING *
        `,
        [customer_id, store_id, address_id, notes]
      );

      order_id = orderResult.rows[0].id;
    } else {
      order_id = orderResult.rows[0].id;
    }

    // 4. Get item price
    const itemResult = await client.query(
    `SELECT price 
      FROM items
      WHERE id = $1
      AND store_id = $2
      `,
      [item_id, store_id]
    );

    if (itemResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Item not found in this store" });
    }

    const price = itemResult.rows[0].price;

    // 5. Add item to order_items
    const orderItemResult = await client.query(
      `
      INSERT INTO order_items 
        (order_id, item_id, quantity, price)
      VALUES 
        ($1, $2, $3, $4)
      RETURNING *
      `,
      [order_id, item_id, quantity, price]
    );

    // 6. Update total_price
    const updatedOrder = await client.query(
      `
      UPDATE orders
      SET total_price = (
        SELECT COALESCE(SUM(quantity * price), 0)
        FROM order_items
        WHERE order_id = $1
      )
      WHERE id = $1
      RETURNING *
      `,
      [order_id]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Item added to cart",
      order: updatedOrder.rows[0],
      item: orderItemResult.rows[0]
    });

  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
});
const removeFromCart = asyncHandler(async (req, res) => {
  const { order_id, item_id } = req.body;

  const result = await pool.query(
    `DELETE FROM order_items
    WHERE order_id = $1
      AND item_id = $2
      AND order_id IN (
        SELECT o.id
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        WHERE c.user_id = $3
          AND o.status = 'cart'
      )
    RETURNING *;
    `,
    [order_id, item_id, req.user.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      message: "Item not found in your cart"
    });
  }

  res.status(200).json({
    message: "Item removed from cart",
    removedItem: result.rows[0]
  });
});
// get order item
const getOrderItems= asyncHandler(async(req,res)=>{
    const order_id= req.body.order_id
    const items = await pool.query(
        `select * from order_items 
        where order_id=$1 and 
        order_id in (select o.id FROM orders o
            JOIN customers c on c.id=o.customer_id
             WHERE c.user_id = $2
        )`,[order_id,req.user.id])
        res.status(200).json(items.rows)
})
// checkout
const checkout = asyncHandler(async(req,res)=>{
    const order = await pool.query(
        `update orders 
        set status ='pending'
        where id =$1 and status = 'cart'AND
         customer_id= (select id from customers where user_id=$2)
         RETURNING *;
         `,[req.body.order_id,req.user.id])
    if (order.rows.length === 0) {
  return res.status(404).json("cart not found or already checked out");
}
         res.status(200).json(order.rows[0])

})

const changeStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const allowedStatus = ["pending", "accepted", "rejected", "preparing", "ready", "delivered"];

  if (!allowedStatus.includes(status)) {
    return res.status(400).json(`status must be one of: ${allowedStatus.join(", ")}`);
  }

  const order = await pool.query(
    `UPDATE orders
     SET status = $1
     WHERE store_id IN (
       SELECT id FROM stores WHERE owner_id = $2
     )
     AND id = $3
     RETURNING *;`,
    [status, req.user.id, req.params.id]
  );

  if (order.rows.length === 0) {
    return res.status(404).json("order not found or you are not the owner");
  }

  return res.status(200).json(order.rows[0]);
});


const getOrderDetails=asyncHandler(async (req, res) => {
  const order = await pool.query(
    `SELECT *
     FROM orders
     WHERE id = $1
       AND (
         customer_id = (
           SELECT id FROM customers WHERE user_id = $2
         )
         OR
         store_id IN (
           SELECT id FROM stores WHERE owner_id = $2
         )
       )
     `,
    [req.params.id, req.user.id]
  );

  if (order.rows.length === 0) {
    return res.status(404).json("order not found or you are not allowed");
  }

  return res.status(200).json(order.rows[0]);
})


const updateQuantity = asyncHandler(async (req, res) => {
  const { quantity } = req.body;

  if (quantity <= 0) {
    return res.status(400).json("quantity must be more than 0");
  }

  const item = await pool.query(
    `UPDATE order_items
     SET quantity = $1
     WHERE id = $2
       AND order_id IN (
         SELECT o.id
         FROM orders o
         WHERE o.customer_id = (
           SELECT c.id
           FROM customers c
           WHERE c.user_id = $3
         )
         AND o.status = 'cart'
       )
     RETURNING *`,
    [quantity, req.params.id, req.user.id]
  );

  if (item.rows.length === 0) {
    return res.status(404).json("cart item not found");
  }

  return res.status(200).json(item.rows[0]);
});
module.exports = {updateQuantity,getOrderDetails,changeStatus,checkout,addToCart,removeFromCart,getOrderItems };