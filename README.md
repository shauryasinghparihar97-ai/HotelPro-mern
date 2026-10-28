# HotelPro — Complete Hotel Booking and Management System (MERN)

[![Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://reactjs.org/)
[![Node](https://img.shields.io/badge/Node-v20+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Local%20%7C%20Atlas-brightgreen.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

HotelPro is a responsive, full-stack hotel booking and property management system built with the MERN stack (MongoDB, Express.js, React, Node.js) and styled with Bootstrap 5 and luxury hotel aesthetics. It is suitable for college full-stack software engineering projects, technical portfolio demonstrations, and SkillWallet evaluations.

---

## 📑 Table of Contents
1. [Project Overview & Key Features](#-project-overview--key-features)
2. [Tech Stack & Architecture](#-tech-stack--architecture)
3. [Folder Structure](#-folder-structure)
4. [Prerequisites](#-prerequisites)
5. [Installation & Setup](#-installation--setup)
6. [Environment Variables](#-environment-variables)
7. [Database Configuration & Seeding](#-database-configuration--seeding)
8. [Running the Application](#-running-the-application)
9. [Automated Acceptance Testing](#-automated-acceptance-testing)
10. [REST API Documentation](#-rest-api-documentation)
11. [Role-Based Access & Booking Logic](#-role-based-access--booking-logic)
12. [Git & GitHub Repository Upload Guide](#-git--github-repository-upload-guide)
13. [SkillWallet Evaluator Demonstration Checklist](#-skillwallet-evaluator-demonstration-checklist)

---

## 🌟 Project Overview & Key Features

### 🏨 Public Guest Experience
- **Luxury Hospitality UI**: Navy, warm gold (`#C5A880`), and crisp white theme with Google Fonts (*Playfair Display* & *Plus Jakarta Sans*).
- **Interactive Search & Availability**: Search rooms by check-in / check-out dates, guest count, and room category.
- **Dynamic Filter Controls**: Filter by category (Single, Double, Deluxe, Suite, Presidential), price slider, capacity, and live search keywords.
- **Suite Details & Real-Time Price Engine**: Multi-photo gallery preview, amenities badges, live calculation of nights and total price with tax breakdown.
- **Direct Online Booking**: Validated reservation workflow preventing double bookings.
- **Instant Printable Confirmation Receipt**: Detailed booking voucher with reference ID and print function.
- **Informative Pages**: Dedicated About page (heritage, commitments), Contact page (direct concierge inquiry form, 24/7 desk info, and interactive FAQ accordion).

### 🔐 Authentication & Security
- **Role-Based Access Control (RBAC)**: Distinguishes between `customer` and `admin` roles.
- **Secure Password Hashing**: Passwords encrypted using `bcryptjs` (salt rounds: 10).
- **Stateless JWT Authorization**: Bearer token authentication verified via server middleware.
- **Data Protection**: Password hashes and secrets are never returned in queries or API payloads (`select: false` and `toJSON` sanitization).
- **Protected Client Routes**: React Router guards ensuring unauthorized users cannot access customer or admin dashboards.

### 👤 Customer Portal
- **Booking History**: Real-time table of past and upcoming stays with status badges (`Confirmed`, `Pending`, `Cancelled`).
- **Cancellation Rights**: Guests can cancel reservations prior to check-in with automatic room inventory release.
- **Profile Management**: Update guest name, phone number, and securely change password with current password verification.

### 🛡️ Administrator Operations Dashboard
- **Executive Analytics**: Real-time KPI statistics (Total Revenue, Total Rooms, Total Bookings, Active Stays, Estimated Occupancy Rate).
- **Suite Inventory CRUD**: Add new rooms with custom photo URLs, edit existing specifications, or delete rooms without active bookings.
- **Reservation Desk**: View all guest bookings, search by guest name or room number, and update booking status (`Confirmed`, `Pending`, `Cancelled`, `Completed`) or payment status (`Pending`, `Paid`, `Refunded`).
- **Guest Directory**: View all registered users, total booking counts, total expenditure, and promote/demote administrator privileges.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, React Router v6, Bootstrap 5.3, Bootstrap Icons, Axios |
| **Backend** | Node.js, Express.js 4, RESTful Architecture, Morgan HTTP Logger |
| **Database** | MongoDB, Mongoose 8 (Indexes, Pre-save hooks, Compound Queries) |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` |
| **Testing** | Supertest, Custom Acceptance Test Suite |

---

## 📁 Folder Structure

```
hotelpro-mern/
├── client/                      # Frontend React + Vite application
│   ├── public/                  # Static assets & favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # Navbar, Footer, ProtectedRoute, AlertMessage, LoadingSpinner, StarRating
│   │   │   └── rooms/           # RoomCard, RoomFilter
│   │   ├── context/             # AuthContext (JWT session state)
│   │   ├── pages/               # Home, Rooms, RoomDetail, BookingConfirmation, CustomerDashboard, AdminDashboard, Login, Register, About, Contact, NotFound
│   │   ├── services/            # Axios API wrappers (auth, rooms, bookings, admin)
│   │   ├── App.jsx              # Application router and layout
│   │   ├── index.css            # Custom luxury hotel styling
│   │   └── main.jsx             # Entry point
│   ├── .env.example             # Client environment template
│   ├── index.html
│   ├── package.json
│   └── vite.config.js           # Vite dev proxy configuration
├── server/                      # Backend Node.js + Express API
│   ├── config/                  # MongoDB Mongoose connection
│   ├── controllers/             # authController, roomController, bookingController, adminController
│   ├── middleware/              # authMiddleware, errorMiddleware
│   ├── models/                  # User, Room, Booking
│   ├── routes/                  # authRoutes, roomRoutes, bookingRoutes, adminRoutes
│   ├── tests/                   # runAcceptanceTests.js (Supertest integration suite)
│   ├── utils/                   # seedData.js, generateToken.js, dateUtils.js
│   ├── .env.example             # Server environment template
│   ├── package.json
│   └── server.js                # Server entry point & CORS
├── .gitignore                   # Excludes node_modules, .env, build output
├── package.json                 # Monorepo root automation scripts
└── README.md                    # Project documentation
```

---

## 💻 Prerequisites

Ensure you have installed on your workstation:
1. **Node.js**: v18.x, v20.x, or v22+ ([Download](https://nodejs.org/))
2. **NPM**: v9+ (comes with Node.js)
3. **MongoDB**: Local MongoDB Community Server running on `mongodb://127.0.0.1:27017` OR a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).

---

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/shauryasinghparihar97-ai/HotelPro-mern.git
cd HotelPro-mern
```

### 2. Install Dependencies
You can install dependencies for both frontend and backend using the root helper script:
```bash
npm run install:all
```
*Or install separately:*
```bash
cd server && npm install
cd ../client && npm install
```

---

## 🔐 Environment Variables

Create `.env` files in both `server/` and `client/` directories based on the provided `.env.example` templates.

### Server Environment (`server/.env`)
```ini
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/hotelpro
JWT_SECRET=your_super_secret_jwt_key_here_change_for_production
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```
> **Note for MongoDB Atlas Users**: If using MongoDB Atlas, replace `MONGODB_URI` with your connection string:  
> `MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/hotelpro?retryWrites=true&w=majority`

### Client Environment (`client/.env`)
```ini
VITE_API_URL=/api
```

---

## 🗄️ Database Configuration & Seeding

### 1. Ensure MongoDB is Running
- **Local MongoDB**: Ensure the service is active (`Get-Service -Name MongoDB` or `mongod`).
- **MongoDB Atlas**: Ensure Network Access includes your current IP address (or `0.0.0.0/0` during development).

### 2. Populate Demo Data
Run the database seed utility to clear any old records and populate default users and luxury suites:
```bash
npm run seed
```
*(or from the `server/` directory: `node utils/seedData.js`)*

### 🔑 Demo Accounts (Pre-configured)
| Role | Email | Password | Privileges |
|---|---|---|---|
| **Administrator** | `admin@hotelpro.com` | `AdminPassword123!` | Full admin dashboard, room CRUD, manage all bookings & users |
| **Customer** | `customer@hotelpro.com` | `CustomerPassword123!` | Book rooms, cancel own bookings, edit guest profile |

*(The login screen also includes convenient 1-click "Customer Demo" and "Admin Demo" fill buttons for fast evaluation).*

---

## 🏃 Running the Application

### Option A: Run Both Simultaneously (Two Terminals)

**Terminal 1 — Backend API Server:**
```bash
cd server
npm run dev
# Server will start on http://localhost:5000
```

**Terminal 2 — Frontend Client:**
```bash
cd client
npm run dev
# Frontend will start on http://localhost:5173
```

Visit **`http://localhost:5173`** in your browser.

---

## 🧪 Automated Acceptance Testing

HotelPro includes an automated backend acceptance test suite testing all 14 core system constraints:
- Server initialization & health check
- User registration and role enforcement
- Bcrypt password hashing & secret shielding
- JWT generation and invalid token rejection
- Protected route guards
- Role authorization (Customers forbidden from admin endpoints)
- Room listing and filtering
- Valid booking date calculation and price calculation
- **Strict overlap rejection**: Verifying overlapping dates for the same room return HTTP 409
- **Edge cases**: Rejecting check-out before check-in, past dates, exceeding guest capacity
- **Customer data isolation**: Preventing cross-customer booking inspection
- Administrator room CRUD operations
- Customer booking cancellation and inventory restoration

Run the test suite with:
```bash
npm test
```
*(or from `server/`: `npm run test`)*

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new customer account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT |
| `GET` | `/api/auth/me` | Private | Retrieve logged-in user profile |
| `PUT` | `/api/auth/profile` | Private | Update name, phone, or password |

### Rooms (`/api/rooms`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/rooms` | Public | List rooms with filters (`type`, `guests`, `minPrice`, `maxPrice`, `checkIn`, `checkOut`, `search`) |
| `GET` | `/api/rooms/:id` | Public | Retrieve single room details |
| `GET` | `/api/rooms/:id/availability` | Public | Check room availability for date range |
| `POST` | `/api/rooms` | Admin | Create a new room |
| `PUT` | `/api/rooms/:id` | Admin | Update room specifications |
| `DELETE`| `/api/rooms/:id` | Admin | Delete room (blocked if active bookings exist) |

### Bookings (`/api/bookings`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/bookings` | Private | Book a room with server-side validation & pricing |
| `GET` | `/api/bookings/my-bookings`| Private | Retrieve all bookings for current customer |
| `GET` | `/api/bookings/:id` | Private | Retrieve single booking (owner or admin only) |
| `PUT` | `/api/bookings/:id/cancel`| Private | Cancel booking (owner or admin only) |

### Administration (`/api/admin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/stats` | Admin | Dashboard metrics (revenue, occupancy, counts) |
| `GET` | `/api/admin/bookings` | Admin | All guest reservations with status filters |
| `PUT` | `/api/admin/bookings/:id`| Admin | Update booking & payment status |
| `GET` | `/api/admin/users` | Admin | List all registered users with booking metrics |
| `PUT` | `/api/admin/users/:id/role`| Admin | Promote/demote user role |

---

## 🔒 Role-Based Access & Booking Logic

1. **Overlap Prevention**:
   A room is flagged as conflicting if any confirmed or pending reservation overlaps:
   `existing.checkIn < requested.checkOut && existing.checkOut > requested.checkIn`
2. **Server-Derived Pricing**:
   The client only submits the `roomId` and dates. The server verifies room pricing from MongoDB and calculates:
   `nights = (checkOut - checkIn) in days`  
   `totalPrice = nights * room.pricePerNight`
3. **No Fake Payment Claims**:
   Payment status defaults to `Pending` with clear notice that charges are processed upon hotel check-in.
4. **Data Isolation**:
   Customer endpoints enforce `booking.user.toString() === req.user._id.toString()`, completely preventing cross-tenant access.

---

## 🐙 Git & GitHub Repository Upload Guide

Follow these steps to upload HotelPro to your GitHub repository `hotelpro-mern`:

```bash
# 1. Check git status (ensure no .env or node_modules are tracked)
git status

# 2. Stage all project files
git add .

# 3. Create initial commit
git commit -m "feat: complete HotelPro hotel booking and management system (MERN)"

# 4. Set main branch
git branch -M main

# 5. Add your GitHub remote repository
git remote add origin https://github.com/shauryasinghparihar97-ai/HotelPro-mern.git

# 6. Push to GitHub
git push -u origin main
```

---

## 👨‍💻 Author & Maintainer

- **Developer**: Shaurya Singh Parihar ([@shauryasinghparihar97-ai](https://github.com/shauryasinghparihar97-ai))
- **Repository**: [https://github.com/shauryasinghparihar97-ai/HotelPro-mern](https://github.com/shauryasinghparihar97-ai/HotelPro-mern)

---

## 🎯 SkillWallet Evaluator Demonstration Checklist

Use this quick checklist during your live technical evaluation:

1. [ ] **Backend Health Check**: Show `GET http://localhost:5000/api/health` displaying MongoDB connected status.
2. [ ] **Public Browsing**: Walk through the responsive Home page, floating date search bar, and suite listings.
3. [ ] **Filtering**: Demonstrate filtering rooms by Category (e.g. Presidential, Deluxe) and maximum price range.
4. [ ] **Customer Booking Flow**:
   - Log in using `customer@hotelpro.com` / `CustomerPassword123!` (or 1-click demo button).
   - Navigate to a Suite details page.
   - Pick valid dates (notice the real-time night and price calculation).
   - Click "Confirm & Book Suite" and show the generated Booking Confirmation receipt with reference ID.
5. [ ] **Booking Verification & Conflict Handling**:
   - Try booking the exact same room for the same dates: demonstrate the clean `409 Conflict` rejection modal.
6. [ ] **Customer Dashboard**:
   - Navigate to `/dashboard` to view the booking in My Reservations.
   - Demonstrate updating profile details.
   - Demonstrate canceling a reservation and show status updating to `Cancelled`.
7. [ ] **Admin Dashboard**:
   - Log in using `admin@hotelpro.com` / `AdminPassword123!`.
   - Show dashboard statistics cards (Total Revenue, Rooms, Bookings, Occupancy Rate).
   - Create a new room with custom amenities and image.
   - Edit booking status from Confirmed to Completed.
   - View registered users and demonstrate role promotion.
8. [ ] **Security Review**:
   - Open Network tab: verify passwords and hashes are never exposed in JSON responses.
   - Confirm `.env` files are git-ignored.
9. [ ] **Run Test Suite**:
   - Execute `npm test` in the terminal to show all 24 acceptance criteria passing green.
