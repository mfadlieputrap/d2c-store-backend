# 🛍️ D2C Store Backend

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)
![Express](https://img.shields.io/badge/Express.js-Backend-black?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)
![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-blue?logo=openapiinitiative)
![Status](https://img.shields.io/badge/status-under--development-yellow)
![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen)


This is the backend service for a Direct-to-Consumer (D2C) fashion brand store. Built using **Node.js**, **Express.js**, and **MongoDB**, this project handles user authentication, account management, and is being developed to support orders and payments.

> ⚠️ **Status:** Under Development  
> We're still building and refining features—stay tuned!

---

## 📦 Features (Planned & In Progress)

- [x] User Authentication (Register/Login)
- [x] User Profile & Role-based Access Control (RBAC)
- [x] Address & Bank Account Management
- [x] Product & Catalog Management
- [x] Order Processing
- [x] Payment Integration with Midtrans
- [ ] Admin Management Dashboard (API-only)
---

## 🧩 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT + Bcrypt
- **Validation:** Express-validator
- **Documentation:** OpenAPI (YAML), Redocly CLI
- **Testing:** Jest (planned)

---

## 📂 Project Structure (Current)

```bash 
d2c-store-backend/
├── config/
│   └── db.js
├── controllers/
│   ├── addressController.js
│   ├── authController.js
│   ├── bankAccountController.js
│   ├── cartController.js
│   ├── categoryController.js
│   ├── orderController.js
│   ├── paymentController.js
│   ├── productController.js
│   ├── userController.js
│   └── wishlistController.js
├── docs/
│   ├── components/
│   │   ├── responses.yaml
│   │   ├── schemas.yaml
│   │   └── examples.yaml
│   ├── paths/
│   │   ├── authApi.yaml
│   │   ├── userApi.yaml
│   │   ├── addressApi.yaml
│   │   ├── bankAccountApi.yaml
│   │   ├── productApi.yaml
│   │   ├── orderApi.yaml
│   │   ├── paymentApi.yaml
│   │   ├── cartApi.yaml
│   │   ├── categoryApi.yaml
│   │   └── wishlistApi.yaml
│   └── openapi.yaml
├── middleware/
│   ├── authMiddleware.js
│   ├── uploadMiddleware.js
│   ├── validateUserExists.js
│   └── handleValidator.js
├── models/
│   ├── Address.js
│   ├── BankAccount.js
│   ├── Cart.js
│   ├── Category.js
│   ├── Order.js
│   ├── Payment.js
│   ├── Product.js
│   ├── User.js
│   └── Wishlist.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── addressRoutes.js
│   ├── bankAccountRoutes.js
│   ├── index.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   ├── categoryRoutes.js
│   ├── orderRoutes.js
│   ├── paymentRoutes.js
│   └── wishlistRoutes.js
├── utils/
│   ├── applyUpdateFields.js
│   ├── checkStock.js
│   ├── checkUserExists.js
│   ├── comparePassword.js
│   ├── customValidators.js
│   ├── dummyHelper.js
│   ├── generateToken.js
│   ├── hashPassword.js
│   ├── logger.js
│   ├── midtrans.js
│   ├── orderHelper.js
│   └── responseHelper.js
├── validators/
│   ├── authValidator.js
│   └── entityValidator.js
├── .redocly.yaml
├── .env
├── .gitignore
├── server.js
└── package.json

```
---

## 📖 API Documentation

All API endpoints are documented in `docs/openapi.yaml`. You can view it with Swagger UI, Postman, or Redocly.  

To generate bundled API spec:
```bash
npm run bundle
```
---

## 🛠️ Getting Started

### 🔐 Environment Variables

Make sure to configure these in your `.env`:

- `PORT=5000`
- `MONGO_URI=mongodb://localhost:27017/d2cstore`
- `JWT_SECRET=your_jwt_secret`
- `MIDTRANS_CLIENT_KEY=xxx`
- `MIDTRANS_SERVER_KEY=xxx`


```bash
# 1. Clone the repo
git clone https://github.com/your-username/d2c-store-backend.git

# 2. Navigate into project folder
cd d2c-store-backend

# 3. Install dependencies
npm install

# 4. Set up environment variables
cp .env.example .env
# Then edit the .env file as needed

# 5. Run the development server
npm run dev

# 6. Generate bundled API spec:
npm run bundle
```

---

## 🧪 Testing

This project includes unit and integration tests for key features using [Jest](https://jestjs.io/) and [Supertest](https://github.com/visionmedia/supertest).

- All tests are located in the `/tests` folder
- Tests cover:
    - Authentication (register, login, change password)
    - User management
    - Address management
    - Product CRUD
    - Cart, Wishlist, and Order flow
- Uses mock models and mocked database connections to ensure isolated testing
- All tests are currently passing ✅

To run tests locally:

```bash
npm run test
```

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
