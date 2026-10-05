# Toys API

REST API for managing toys and users, built with Node.js, Express and MongoDB.

## Base URL

http://localhost:3001

---

# Toys Routes

## Get Toys

Returns toys from the database, 10 toys per page.

**GET**
/toys

Query:

- `skip` - page number.

Example:

GET /toys?skip=0

---

## Search Toys

Search for toys by name or info.

**GET**
/toys/search

Query:

- `s` - search text.
- `skip` - page number.

Example:

GET /toys/search?s=lego&skip=0

---

## Get Toys By Category

Returns toys from a specific category.

**GET**
/toys/category/:catname

Example:

GET /toys/category/dolls?skip=0

---

## Get Single Toy

Returns one toy by its MongoDB ID.

**GET**
/toys/single/:id

Example:

GET /toys/single/6ac3779206d087a67e233245

---

## Get Toys Count

Returns the number of toys in the collection.

**GET**
/toys/count

---

## Add Toy

Creates a new toy.

**POST**
/toys

This route requires authentication.

Header:

x-api-key: YOUR_TOKEN

Body example:

{
  "name": "Teddy Bear",
  "info": "Soft teddy bear",
  "category": "dolls",
  "img_url": "teddy_bear.jpg",
  "price": 99
}

The `user_id` is automatically taken from the authenticated user's token.

Validation:

- `name` - required, 2-99 characters.
- `info` - required, 2-500 characters.
- `category` - required, 2-99 characters.
- `img_url` - optional.
- `price` - required, number between 1 and 999.

---

## Update Toy

Updates a toy by ID.

**PUT**
/toys/:id

This route requires authentication.

Header:

x-api-key: YOUR_TOKEN

A user can update only a toy that belongs to their `user_id`.

Body example:

{
  "name": "Teddy Bear",
  "info": "Large soft teddy bear",
  "category": "dolls",
  "img_url": "teddy_bear.jpg",
  "price": 120
}

---

## Delete Toy

Deletes a toy by ID.

**DELETE**
/toys/:id

This route requires authentication.

Header:

x-api-key: YOUR_TOKEN

A user can delete only a toy that belongs to their `user_id`.

---

# Users Routes

## Register User

Creates a new user.

**POST**
/users

Body example:

{
  "name": "Rotem",
  "email": "rotem@test.com",
  "password": "123456"
}

The password is encrypted using bcrypt before being stored in MongoDB.

The email must be unique.

The default role for a new user is `USER`.

---

## Login

Logs in an existing user.

**POST**
/users/login

Body example:

{
  "email": "rotem@test.com",
  "password": "123456"
}

If the email and password are correct, the API returns a JWT token.

Use the returned token in protected Toys routes:

x-api-key: YOUR_TOKEN

---

# Authentication

Authentication is implemented using JSON Web Token (JWT).

Protected routes:

- POST /toys
- PUT /toys/:id
- DELETE /toys/:id

The token must be sent in the request header using:

x-api-key

Example:

x-api-key: YOUR_TOKEN

Passwords are encrypted using bcrypt.

The JWT secret and other sensitive configuration are stored in the `.env` file.

The `.env` file and `node_modules` directory are excluded from Git using `.gitignore`.

---

# Toy Model

Each toy contains:

- name
- info
- category
- img_url
- price
- user_id
- createdAt
- updatedAt

---

# User Model

Each user contains:

- name
- email
- password
- role
- createdAt
- updatedAt

---

# Technologies

- Node.js
- Express
- MongoDB
- Mongoose
- Joi
- bcrypt
- JSON Web Token (JWT)
- dotenv

---

# Running The Project

Install dependencies:

npm install

Run the server:

node app.js

The server runs on:

http://localhost:3001