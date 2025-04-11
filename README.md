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

## 📂 Project Structure (Current)

```bash 
d2c-store-backend/
├───config/
├───controllers/
│   ├───addressController.js
│   ├───authController.js
│   ├───bankAccountController.js
|   └───userController.js
├───docs/
│   ├───components/
|   |   ├───responses.yaml
|   |   └───schemas.yaml
│   ├───paths/
|   |   ├───authApi.yaml
|   |   └───userApi.yaml
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
├───routes/
├───utils/
|   ├───checkUserExists.js
|   ├───comparePassword.js
|   ├───generateToken.js
|   └───hashPassword.js
└───validators/
    └───authValidator.js

```
---

## 📖 API Documentation

All API endpoints are documented in `docs/openapi.yaml`. You can view it with Swagger UI, Postman, or Redocly.

---

## 🛠️ Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Environment Variables
# Create .env file based on .env.example (coming soon)

```

---

## 🧪 Testing (Coming Soon)

I will add test coverage once core features are completed

---

## 📌 Note

This project is part of a portfolio to demonstrate secure backend design using RBAC, modular architecture, and to showcase my knowledge and practical understanding of backend development

---

## 📬 Contact

Feel free to reach out if you're curious about the project or want to collaborate:  
  
- 📧 **Email**: mfadlieputrap@gmail.com
- 💼 **linkedin**: [linkedin.com/in/mfadlieputrap](https://www.linkedin.com/in/mfadlieputrap)

---

## 👨‍💻 Author

Name: Muhamad Fadlie Putra Pratama