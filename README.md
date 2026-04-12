# FoodHub Backend

> A scalable backend system for a multi-role food delivery platform.

FoodHub is a robust backend solution designed to handle the complexities of a multi-role food delivery ecosystem. It facilitates seamless interactions between Admin, Customers, Providers (Vendors), Managers, and Riders. The system manages the entire lifecycle of an order—from placement to delivery—using a session-based secure authentication flow and a optimized Cash on Delivery (COD) order management system.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- **Multi-Role RBAC:** Granular access control for Admin, Customer, Provider, Manager, and Rider.
- **Better Auth Integration:** Secure session management using advanced cookie handling.
- **Social Login:** Integrated Google OAuth for seamless user onboarding.

### 📦 Order Management
- **COD-First System:** Specialized handling for Cash on Delivery orders.
- **Real-time Status Tracking:** Order lifecycle: `PENDING` → `PREPARING` → `ASSIGNED`  → `DELIVERED`.
- **Rider Assignment:** Automated availability of orders to riders once they reach the `PREPARING` stage.

### 🏢 Vendor & Rider Operations
- **Provider Dashboard:** Tools for vendors to manage menus, accept/prepare orders.
- **Rider Workflow:** Efficient order acceptance and delivery tracking.
- **Manager Overlays:** Administrative oversight for regional operations.

### 📊 Analytics & AI Insights
- **Hybrid AI Search:** Semantic searching with typo correction and dynamic suggestions using OpenAI.
- **AI-Powered Insights:** Data-driven metrics and automated business summaries for Admins and Providers using Groq/Llama-3.
- **Performance Dashboards:** Visual representation of sales, delivery times, and user growth.

### 🎫 Promotions
- **Coupon System:** Dynamic discount management and referral incentives.

---

## 🛠 Tech Stack

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Next.js API Routes](https://nextjs.org/) / [Express.js](https://expressjs.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (hosted on [Neon](https://neon.tech/))
- **ORM:** [Prisma](https://www.prisma.io/)
- **Auth:** [Better Auth](https://better-auth.com/) & Google OAuth
- **deployment:** [Vercel](https://vercel.com/)

---

## ⚙️ Installation & Setup

### 1. Clone the Repository 
```bash
git clone https://github.com/shakhawat-coder/foodhub-backend.git
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and configure the following:

```env
DATABASE_URL=
APP_URL=http://localhost:3000
PORT=5000

# Better Auth Configuration
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000 # Public frontend URL

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Social Auth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/callback/google

# AI Configuration
GROQ_API_KEY=
```

### 4. Database Setup
```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Run Development Server
```bash
npm run dev
```

---

## 📡 API Endpoints Overview

| Endpoint | Description |
| :--- | :--- |
| `/api/auth` | Authentication (Login, Signup, OAuth, Sessions) |
| `/api/users` | User profile and account management |
| `/api/orders` | Core order placement and lifecycle management |
| `/api/riders` | Rider availability and assignment logic |
| `/api/providers` | Vendor menu and order preparation controls |
| `/api/admin` | System-wide administrative settings & management |
| `/api/analytics` | Statistical data for dashboards |

---

## 🔄 Business Logic Flows

### Authentication Flow
1. User chooses between Email/Password or **Google OAuth**.
2. **Better Auth** validates credentials and creates a session.
3. Secure, `HttpOnly` cookies are issued to the client.
4. Logic redirects the user to their specific dashboard based on their **Role**.

### Order Lifecycle
1. **Customer** places an order via **Cash on Delivery (COD)**.
2. **Vendor** receives notification & accepts → Status: `PREPARING`.
3. Order becomes "Visible" to all available **Riders**.
4. **Rider** accepts the order → Status: `ASSIGNED`.
5. **Rider** completes delivery → Status: `DELIVERED`.

---



## 🛡 Security Policy
- **CSRF Protection:** Secure cookie handling and trusted origin verification.
- **RBAC:** Every endpoint is protected by role-based middleware.
- **Production Grade:** Deployment via Vercel ensures optimized performance and security headers.

---

## 🚀 Future Roadmap
- [ ] **Online Payments:** Integration with Stripe/SSLCommerz.
- [ ] **Real-time Tracking:** WebSockets integration for live rider location.
- [ ] **Push Notifications:** Mobile and Web push for order status updates.

---

