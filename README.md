# Store Backend API

A RESTful backend API for a multi-store ordering platform, built with **Node.js**, **Express.js**, and **PostgreSQL**.

The project supports user authentication, customer profiles, store management, item management, cart functionality, checkout flow, order status updates, and admin store approval.

---

## Features

### Authentication
- Register new users
- Login users
- Password hashing using bcrypt
- JWT authentication
- Role-based access control

### Roles
- Customer
- Store owner
- Admin

### Customer
- Create customer profile
- Add customer address
- Get customer profile
- Get customer addresses
- Update customer information

### Store
- Create store
- Get all stores
- Get store by ID
- Update store information
- Delete store
- Store ownership protection

### Items
- Create item for a store
- Get all items for a store
- Get item by ID
- Update item
- Delete item
- Store owner authorization for item management

### Cart and Orders
- Add item to cart
- Remove item from cart
- Get cart/order items
- Update item quantity
- Checkout cart
- Change order status
- Get order details
- Customer and store owner order protection

### Admin
- Get all users
- Accept store requests
- Admin-only protected routes

---

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- pg
- JSON Web Token
- bcrypt
- Joi
- express-async-handler
- dotenv

---

## Project Structure

```txt
store/
├── config/
│   └── db.js
├── controller/
│   ├── adminController.js
│   ├── authController.js
│   ├── customerController.js
│   ├── itemController.js
│   ├── orderController.js
│   └── storeController.js
├── middlewear/
│   ├── authtoken.js
│   ├── admin.js
│   ├── customer.js
│   └── store.js
├── route/
│   ├── admin.js
│   ├── auth.js
│   ├── customer.js
│   ├── item.js
│   ├── order.js
│   └── store.js
├── server.js
├── package.json
└── README.md
```

---

## Environment Variables

Create a `.env` file in the root folder:

```env
PORT=5001
SECRYTKEY=your_jwt_secret_key

DB_USER=your_database_user
DB_HOST=localhost
DB_NAME=your_database_name
DB_PASSWORD=your_database_password
DB_PORT=5432
```

---

## Installation and Running

### 1. Clone the repository

```bash
git clone https://github.com/saleh-naeem/store.git
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create PostgreSQL database

Create your database in PostgreSQL or pgAdmin.

### 4. Add environment variables

Create a `.env` file and add your database configuration and JWT secret.

### 5. Run the server

```bash
node server
```

Server will run on:

```txt
http://localhost:5001
```

---

## Main API Routes

Base URL:

```txt
/api/store
```

---

## Auth Routes

```txt
POST /api/store/register
POST /api/store/login
```

---

## Customer Routes

```txt
POST /api/store/customer
GET /api/store/customer
PUT /api/store/customer
GET /api/store/customer/address
```

---

## Store Routes

```txt
POST /api/store/store
GET /api/store/store
GET /api/store/store/:id
PUT /api/store/store/:id
DELETE /api/store/store/:id
GET /api/store/store/categories/s
```

---

## Item Routes

```txt
POST /api/store/item
GET /api/store/item/store/:storeId
GET /api/store/item/:id
PUT /api/store/item/:id
DELETE /api/store/item/:id
```

---

## Order Routes

```txt
POST /api/store/order
GET /api/store/order
DELETE /api/store/order
PUT /api/store/order
PUT /api/store/order/proses/:id
GET /api/store/order/details/:id
PATCH /api/store/order/quantity/:id
```

---

## Admin Routes

```txt
GET /api/store/admin/users
GET /api/store/admin/stores
PATCH /api/store/admin/stores/:id/accept
```

---

## Database Tables

Main tables used in the project:

```txt
users
customers
addresses
stores
categories
store_categories
items
orders
order_items
```

---

## Example User Flow

### Customer Flow

```txt
1. Register
2. Login
3. Create customer profile
4. Add item to cart
5. Update item quantity
6. Checkout order
7. View order details
```

### Store Owner Flow

```txt
1. Register as store owner
2. Login
3. Create store
4. Add items to store
5. View orders for store
6. Update order status
```

### Admin Flow

```txt
1. Login as admin
2. View all users
3. View all stores
4. Accept store requests
```

---

## Security Features

- Passwords are hashed using bcrypt
- JWT authentication
- Protected routes using auth middleware
- Admin-only routes
- Store owner authorization before updating or deleting stores/items
- Customers can access only their own orders
- Store owners can manage only orders related to their stores
- SQL queries use parameterized values to reduce SQL injection risk

---

## Notes

This project was built as a backend portfolio project to practice and demonstrate:

- REST API design
- PostgreSQL relations
- Authentication and authorization
- Role-based access control
- Cart and order logic
- Admin approval workflow
- Clean route/controller structure

---

## Future Improvements

- Add payment integration
- Add reviews and ratings
- Add delivery tracking
- Add product search and filtering
- Add pagination
- Add Swagger API documentation
- Add unit and integration tests
- Add Docker support

---

## Author

**Saleh Naeem**

Backend Developer
