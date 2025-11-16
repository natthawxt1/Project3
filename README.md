# Voucher Shop - Digital Voucher E-Commerce Platform ProjectLAB

A full-stack web application for digital voucher marketplace built with React, TypeScript, and Node.js.

**Repository:** [https://github.com/natthawxt1/Project3](https://github.com/natthawxt1/Project3)

---

## Table of Contents

- [Project Overview](#project-overview)
- [System Architecture](#system-architecture)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation Guide](#installation-guide)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Contributors](#contributors)

---

## Project Overview

### Purpose
This project is a digital marketplace platform designed to facilitate the buying and selling of digital vouchers and gift cards. The system supports multiple product categories including gaming platforms (Steam, PlayStation), streaming services (Netflix, Spotify), and other digital services.

### Target Users
- **Customers:** Browse and purchase digital vouchers with secure payment processing
- **Administrators:** Manage products, orders, users, and gift codes through a comprehensive dashboard

### Key Objectives
1. Provide a user-friendly interface for digital voucher transactions
2. Implement secure authentication and authorization
3. Enable real-time inventory management
4. Generate and distribute unique gift codes upon purchase
5. Track sales analytics and revenue metrics

---

## System Architecture

The application follows a **three-tier architecture**:

1. **Presentation Layer:** React-based single-page application (SPA)
2. **Application Layer:** RESTful API built with Express.js
3. **Data Layer:** MySQL relational database

### Architecture Diagram
---

## Features

### Customer Features
- **Product Catalog:** Browse digital vouchers organized by category
- **Search & Filter:** Find products by name, category, or price range
- **Shopping Cart:** Add, remove, and update product quantities
- **User Authentication:** Secure registration and login system
- **Order Processing:** Complete purchases and receive gift codes
- **Order History:** Track past purchases and access gift codes
- **Profile Management:** Update user information

### Administrator Features
- **Dashboard Analytics:** View real-time statistics (revenue, orders, products, customers)
- **Product Management:** CRUD operations for products and categories
- **Order Management:** View, update, and track order status
- **Gift Code System:** Generate and manage unique redemption codes
- **User Management:** View registered users and their roles
- **Sales Reports:** Analyze top-selling products and revenue trends

### Technical Features
- **Responsive Design:** Mobile-first approach supporting all screen sizes
- **Real-time Updates:** Dynamic data fetching with React hooks
- **Type Safety:** TypeScript implementation for reduced runtime errors
- **API Security:** JWT-based authentication and authorization
- **Input Validation:** Client and server-side data validation
- **Error Handling:** Comprehensive error messages and fallback UI

---

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI framework |
| TypeScript | 5.x | Type-safe JavaScript |
| Vite | 5.x | Build tool and dev server |
| TailwindCSS | 3.x | Utility-first CSS framework |
| Framer Motion | 11.x | Animation library |
| React Router | 6.x | Client-side routing |
| Axios | 1.x | HTTP client |
| Lucide Icons | Latest | Icon library |
| Sonner | Latest | Toast notifications |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | JavaScript runtime |
| Express | 4.x | Web framework |
| MySQL | 8.x | Relational database |
| JWT | 9.x | Authentication tokens |
| Bcrypt | 5.x | Password hashing |
| CORS | 2.x | Cross-origin support |

### Development Tools
- **Version Control:** Git & GitHub
- **Package Manager:** npm
- **Code Editor:** Visual Studio Code (recommended)
- **API Testing:** Postman or Thunder Client

---

## Installation Guide

### Prerequisites
Ensure the following software is installed:
- Node.js (v18 or higher)
- npm (v9 or higher)
- MySQL (v8 or higher)
- Git

### Step 1: Clone Repository
git clone https://github.com/natthawxt1/Project3.git
cd Project3

text

### Step 2: Install Dependencies

**Frontend:**
npm install

text

**Backend** (if in separate directory):
cd backend
npm install

text

### Step 3: Configure Environment Variables

Create a `.env` file in the backend directory:

Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=voucher_shop

JWT Configuration
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d

Server Configuration
PORT=3000
NODE_ENV=development

Frontend URL
FRONTEND_URL=http://localhost:5173

text

### Step 4: Initialize Database

**Option A: Import SQL File**
mysql -u root -p < vouche_db-1.sql

text

**Option B: Manual Setup**
1. Create database: `CREATE DATABASE voucher_shop;`
2. Import schema from `vouche_db-1.sql`
3. Verify tables are created

### Step 5: Start Application

**Terminal 1 - Backend:**
cd backend
npm run dev

Server running on http://localhost:3000
text

**Terminal 2 - Frontend:**
npm run dev

Application running on http://localhost:5173
text

### Step 6: Access Application

Open your browser and navigate to:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000/api

---

## Usage

### For Customers

1. **Registration:**
   - Click "Sign Up" button
   - Fill in name, email, and password
   - Submit form to create account

2. **Browse Products:**
   - View featured products on home page
   - Click "Shop Now" to see all products
   - Filter by category or search by name

3. **Make Purchase:**
   - Add desired items to cart
   - Review cart contents
   - Complete order (requires login)
   - Receive gift codes via order details

4. **View Orders:**
   - Navigate to "My Orders"
   - Click order to view details and gift codes

### For Administrators

1. **Login as Admin:**
   - Email: admin@example.com
   - Password: (from database)

2. **Access Dashboard:**
   - View real-time analytics
   - See top-selling products
   - Monitor recent orders

3. **Manage Products:**
   - Add new products with details
   - Edit existing products
   - Update stock quantities
   - Delete discontinued products

4. **Process Orders:**
   - View all orders
   - Update order status
   - Track revenue metrics

---

## Project Structure

Project3/
│
├── src/ # Frontend source code
│ ├── components/ # Reusable UI components
│ │ ├── ui/ # Base UI components (Button, Card, etc.)
│ │ ├── Navbar.tsx # Navigation bar
│ │ ├── Footer.tsx # Page footer
│ │ └── ...
│ │
│ ├── context/ # React Context providers
│ │ ├── AuthContext.tsx # Authentication state
│ │ └── CartContext.tsx # Shopping cart state
│ │
│ ├── pages/ # Page components
│ │ ├── Home.tsx # Landing page
│ │ ├── Products.tsx # Product listing
│ │ ├── ProductDetail.tsx # Single product view
│ │ ├── Cart.tsx # Shopping cart
│ │ ├── Orders.tsx # Order history
│ │ ├── Profile.tsx # User profile
│ │ ├── Auth.tsx # Login/Register
│ │ └── admin/
│ │ ├── AdminDashboard.tsx
│ │ ├── ProductManagement.tsx
│ │ └── OrderManagement.tsx
│ │
│ ├── services/ # API service layer
│ │ ├── authService.ts # Authentication APIs
│ │ ├── productService.ts # Product APIs
│ │ ├── orderService.ts # Order APIs
│ │ └── categoryService.ts # Category APIs
│ │
│ ├── types/ # TypeScript definitions
│ │ └── index.ts # All type interfaces
│ │
│ ├── lib/ # Utility functions
│ │ └── utils.ts # Helper functions
│ │
│ ├── App.tsx # Main application component
│ ├── main.tsx # Application entry point
│ └── index.css # Global styles
│
├── backend/ # Backend source code
│ ├── controllers/ # Request handlers
│ ├── models/ # Database models
│ ├── routes/ # API routes
│ ├── middleware/ # Custom middleware
│ ├── config/ # Configuration files
│ └── server.js # Server entry point
│
├── public/ # Static assets
├── vouche_db-1.sql # Database schema
├── package.json # Frontend dependencies
├── vite.config.ts # Vite configuration
├── tsconfig.json # TypeScript configuration
├── tailwind.config.js # TailwindCSS configuration
└── README.md # This file


---

## Database Schema

### Tables Overview

**1. users**
- Stores user account information
- Fields: user_id, name, email, password, role, created_at

**2. products**
- Contains product catalog
- Fields: product_id, name, description, price, stock, category_id, image_url, is_active, created_at

**3. categories**
- Product categories
- Fields: category_id, name, description, created_at

**4. orders**
- Customer orders
- Fields: order_id, user_id, total_price, status, created_at

**5. order_items**
- Individual order line items
- Fields: order_item_id, order_id, product_id, quantity, price

**6. gift_codes**
- Digital redemption codes
- Fields: gift_code_id, code, product_id, order_id, status, redeemed_at

### Entity Relationship Diagram

┌────────────┐ ┌────────────┐ ┌────────────┐
│ users │───────│ orders │───────│order_items │
└────────────┘ 1:N └────────────┘ 1:N └────────────┘
│
│ N:1
│
┌────────────┐ ┌────────────┐ ┌──▼─────────┐
│ categories │───────│ products │───────│ gift_codes │
└────────────┘ 1:N └────────────┘ 1:N └────────────┘

---

## API Documentation

### Base URL
http://localhost:5000/api

text

### Authentication Endpoints

**POST /auth/register**
- Description: Create new user account
- Request Body:
{
"name": "John Doe",
"email": "john@example.com",
"password": "password123"
}

text
- Response: User object + JWT token

**POST /auth/login**
- Description: Authenticate user
- Request Body:
{
"email": "john@example.com",
"password": "password123"
}

text
- Response: User object + JWT token

**GET /auth/profile**
- Description: Get current user profile
- Headers: `Authorization: Bearer <token>`
- Response: User object

### Product Endpoints

**GET /products**
- Description: Retrieve all products
- Query Parameters: `category`, `search`, `sort`
- Response: Array of products

**GET /products/:id**
- Description: Get single product
- Response: Product object

**POST /products** (Admin only)
- Description: Create new product
- Headers: `Authorization: Bearer <token>`
- Request Body: Product data
- Response: Created product

### Order Endpoints

**GET /orders**
- Description: Get user's orders
- Headers: `Authorization: Bearer <token>`
- Response: Array of orders

**POST /orders**
- Description: Create new order
- Headers: `Authorization: Bearer <token>`
- Request Body:
{
"cart_items": [
{
"product_id": 1,
"quantity": 2
}
]
}

text
- Response: Created order with gift codes

---

## Contributors

**Project Lead & Developer**
- Name: natthawxt1
- GitHub: [@natthawxt1](https://github.com/natthawxt1)
- Email: [Your Email]

---

## License

This project is licensed under the MIT License.

---

## Acknowledgments

This project was developed as part of [Course Name/University Name] using modern web development technologies and best practices.

**Technologies & Libraries:**
- React Documentation: https://react.dev
- TailwindCSS: https://tailwindcss.com
- Express.js: https://expressjs.com
- MySQL: https://www.mysql.com

---

**Last Updated:** 16 November 2025
