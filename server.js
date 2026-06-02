const express = require("express");
require("dotenv").config();

const pool = require("./config/db");

const app = express();

app.use(express.json());
app.use('/api/store',require('./route/auth'))
app.use('/api/store',require('./route/store'))
app.use('/api/customer',require('./route/customer'))

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});