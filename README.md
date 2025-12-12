# Drone Rush Server

A robust backend API for the Drone Rush e-commerce platform, built with Node.js and Express.js.

## Project Name & Live URL

**Drone Rush Server**
Live Application: [Drone Rush](https://drone-rush-client.vercel.app)

## Features

- User authentication and authorization (JWT, Google OAuth)
- Product management (CRUD for drones, categories, brands)
- E-commerce functionality (shopping cart, wishlist, orders, shipping)
- Payment processing (Stripe, SSL Commerz)
- Image uploads and hosting (Cloudinary)
- Email notifications (Nodemailer)
- Analytics and admin dashboard support
- Rate limiting and error handling

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5.2.1
- **Database**: MongoDB with Mongoose v8.20.2
- **Authentication**: JSON Web Tokens (jsonwebtoken v9.0.3), Argon2 for hashing
- **Payments**: Stripe v20.0.0, SSL Commerz
- **Media**: Cloudinary v2.8.0
- **Emails**: Nodemailer v7.0.11 with EJS templates
- **Validation**: Zod v4.1.13
- **Other Libraries**: Axios v1.13.2, CORS v2.8.5, Cookie Parser v1.4.7, PDFKit v0.17.2
- **Development**: TypeScript v5.9.3, ts-node-dev v2.0.0, Biome v2.3.8

## Setup & Usage Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- pnpm (v10.11.0)

### Installation
1. Clone the repository:
   ```
   git clone https://github.com/Zihad550/drone-rush-server
   cd drone-rush-server
   ```

2. Install dependencies:
   ```
   pnpm install
   ```

3. Create a `.env` file in the root directory and configure the required environment variables. Refer to `src/env.ts` for the complete list of variables (e.g., database URLs, JWT secrets, SMTP settings, payment gateways, Cloudinary credentials).

### Running the Application
- Development mode:
  ```
  pnpm run dev
  ```
  The server will start on the port specified in your `.env` file (default: 5000).

- Production build:
  ```
  pnpm run build
  pnpm start
  ```

### Usage
The API is accessible at `/api/v1`. Use tools like Postman or curl to interact with endpoints. Key routes include:
- Authentication: `/api/v1/auth`
- Products: `/api/v1/drones`
- Orders: `/api/v1/orders`
- Payments: `/api/v1/payments`

Ensure the frontend is configured to point to the backend URL for full functionality.
