# 🛍️ D2C Store Backend

This is the backend service for a Direct-to-Consumer (D2C) fashion brand store. Built using **Node.js**, **Express.js**, and **MongoDB**, this project handles user authentication, account management, and is being developed to support orders and payments.

> ⚠️ **Status:** Under Development  
> We're still building and refining features—stay tuned!

---

## 📦 Features (Planned & In Progress)

- [x] User Authentication (Register/Login)
- [x] User Profile & Role-based Access Control (RBAC)
- [x] Address & Bank Account Management
- [ ] Product & Catalog Management
- [ ] Order Processing
- [ ] Payment Integration with Midtrans

---

## 🧩 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT + Bcrypt
- **API Docs:** OpenAPI (YAML)

---

## 📂 Project Structure (Partial)

```bash 
d2c-store-backend/
├───config
├───controllers
├───docs/
│   ├───components/
|   |   ├───responses.yaml
|   |   └───schemas.yaml
│   ├───paths
|   └───openapi.yaml
├───middleware/
|   └───authMiddleware.yaml
├───models/
|   ├───Address.js
|   ├───BankAccount.js
|   ├───Cart.js
|   ├───Category.js
|   ├───Order.js
|   ├───Payment.js
|   ├───Product.js
|   ├───User.js
|   └───Wishlist.js
├───routes
├───utils/
|   ├───checkUserExists.js
|   ├───comparePassword.js
|   ├───generateToken.js
|   └───hashPassword.js
└───validators/
    └───authValidator.js

```
