const express = require("express");
require("dotenv").config();

const pool = require("./config/db");

const app = express();

app.use(express.json());
app.use('/api/store',require('./route/auth'))
app.use('/api/store/store',require('./route/store'))
app.use('/api/store/customer',require('./route/customer'))
app.use('/api/store/order',require('./route/order'))
app.use('/api/store/item',require('./route/item'))
app.use('/api/store/admin',require('./route/admin'))

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});