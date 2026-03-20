# Velura — MERN Fashion Store

A fully converted MERN stack eCommerce application. Originally built with React + Spring Boot (Java) + MySQL, now rebuilt using **MongoDB, Express.js, React, and Node.js**.

**Niche:** Fashion & Clothing — Brand name: **Velura**

---
## deployment link
https://deploy-preview-1--velura-frontend.netlify.app/

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, React Router v6, Axios  |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB + Mongoose ODM             |
| Auth       | JWT (jsonwebtoken) + bcryptjs     |
| Styling    | Custom CSS with design tokens     |
| Toasts     | react-hot-toast                   |

---

## Project Structure

```
velura-mern-store/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── seed.js            # Seed products + admin user
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── userController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   └── auth.js            # JWT protect + adminOnly
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── userRoutes.js
│   │   └── adminRoutes.js
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── public/index.html
    ├── src/
    │   ├── api.js                     # Axios instance with JWT interceptor
    │   ├── App.js                     # Routes
    │   ├── index.js
    │   ├── context/
    │   │   ├── AuthContext.jsx        # Login/register/logout state
    │   │   └── CartContext.jsx        # Cart state synced with API
    │   ├── components/
    │   │   ├── Navbar.jsx + .css
    │   │   ├── Footer.jsx + .css
    │   │   ├── ProductCard.jsx + .css
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── Home.jsx + .css
    │   │   ├── Products.jsx + .css
    │   │   ├── SingleProduct.jsx + .css
    │   │   ├── Cart.jsx + .css
    │   │   ├── Checkout.jsx + .css
    │   │   ├── Auth.jsx + .css        # Login + Register
    │   │   ├── Orders.jsx + .css
    │   │   ├── ProfileAndSuccess.jsx  # Profile + OrderSuccess
    │   │   ├── Profile.css
    │   │   ├── Admin.jsx + .css
    │   │   ├── AdminLogin.jsx
    │   │   └── NotFound.jsx
    │   └── styles/
    │       └── global.css             # Design system tokens + utilities
    └── package.json
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally on port 27017 (or MongoDB Atlas URI)

### 1. Clone and install dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure environment

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 3. Seed the database

```bash
cd backend
npm run seed
```

This creates:
- **8 sample fashion products** (with real Unsplash images)
- **Admin account:** `admin@velura.com` / `admin123`

### 4. Run the app

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev        # runs on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start          # runs on http://localhost:3000
```

Or from root (requires concurrently):
```bash
npm run dev
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new customer |
| POST | `/api/auth/login` | Login (returns JWT) |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/change-password` | Change password |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products (filter/sort/search/paginate) |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Add product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Soft-delete product (admin) |
| POST | `/api/products/:id/reviews` | Add review (auth) |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user's cart |
| POST | `/api/cart/add` | Add item to cart |
| PUT | `/api/cart/update` | Update item quantity |
| DELETE | `/api/cart/item/:productId` | Remove item |
| DELETE | `/api/cart/clear` | Clear entire cart |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place order |
| GET | `/api/orders/my` | Get my orders |
| GET | `/api/orders/:id` | Get order by ID |
| PUT | `/api/orders/:id/cancel` | Cancel order |
| PUT | `/api/orders/:id/pay` | Simulate payment |
| POST | `/api/orders/validate-coupon` | Validate coupon code |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Stats + recent orders |
| GET | `/api/admin/users` | All customers |
| PUT | `/api/admin/users/:id/status` | Block/unblock user |
| GET | `/api/admin/orders` | All orders |
| PUT | `/api/admin/orders/:id/status` | Update order status |

---

## Features

### Customer
- Browse products with category, sort, search, and tag filters
- Product detail page with image gallery, variants, reviews, trust badges
- Cart with quantity controls, coupon codes, shipping calculation
- Checkout with address form and payment method selection
- Order management (place, view, cancel, pay)
- User profile with address book and password change

### Admin
- Dashboard with revenue, order, product, customer stats
- Add/remove products with full form
- Update order status (Placed → Shipped → Delivered)
- Block/unblock customer accounts

### Brand Design
- **Color palette:** `#1A1A2E` (primary) · `#E8D5C4` (secondary) · `#C4956A` (accent)
- **Typography:** Cormorant Garamond (headings) + Inter (body)
- **60/30/10 color ratio** as per Store Design Standards
- Hero banner with auto-rotating slides
- Collections grid, testimonials, trust bar, newsletter signup

### Coupon Codes
| Code | Discount |
|------|----------|
| `VELURA10` | 10% off |
| `WELCOME20` | 20% off |
| `FLAT15` | 15% off |

---