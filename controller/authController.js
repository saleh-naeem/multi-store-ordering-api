const pool= require('../config/db')
const joi =require('joi')
const bcrypt=require('bcrypt')
const jwt= require('jsonwebtoken')
const asyncHandler =require('express-async-handler')
// validtion
const registerVaild = joi.object({
  email: joi.string().required()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),

  name: joi.string().alphanum().min(3).max(30).required(),

  password: joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required(),

  role: joi.string()
    .valid("customer", "store")
    .default("customer")
});
//login validtion
const loginVaild= joi.object({
    email:joi.string().required()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password:joi.string()
})
const register=asyncHandler(async (req, res) => {

  // validation
  const { error } = registerVaild.validate(req.body);

  if (error) {
    return res.status(400).json(error.details[0].message);
  }

  const { name, email, password, role } = req.body;

  // check if email already exists
  const checkExsit = await pool.query(
    "SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)",
    [email]
  );

  if (checkExsit.rows[0].exists) {
    return res.status(400).json("the user already exists");
  }

  // check if username already exists
  const checkExsitUser = await pool.query(
    "SELECT EXISTS(SELECT 1 FROM users WHERE name = $1)",
    [name]
  );

  if (checkExsitUser.rows[0].exists) {
    return res.status(400).json("the username already exists");
  }

  // hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // insert user
  const r = await pool.query(
    `INSERT INTO users(name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role`,
    [name, email, hashedPassword, role || 'customer']
  );

  const user = r.rows[0];

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
     role: user.role
    },
    process.env.SECRYTKEY,
    { expiresIn: '30d' }
  );

  return res.status(201).json({
    ...user,
    token
  });

})
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // validation
  const { error } = loginVaild.validate(req.body);

  if (error) {
    return res.status(400).json(error.details[0].message);
  }

  // find user by email
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (result.rows.length === 0) {
    return res.status(400).json("the email or password is wrong");
  }

  const user = result.rows[0];

  // compare password
  const isPassword = await bcrypt.compare(password, user.password);

  if (!isPassword) {
    return res.status(400).json("the email or password is wrong");
  }

  // create token
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.SECRYTKEY,
    { expiresIn: '30d' }
  );

  const userData = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  };

  return res.status(200).json({
    ...userData,
    token
  });
})
module.exports={register,login}