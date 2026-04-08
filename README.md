# Druk-E-Com

Druk-E-Com is a full-stack e-commerce platform currently in active development. The project is designed as a role-based marketplace where different users (customers, sellers, admins, delivery staff, and support team members) can operate from dedicated workflows inside one system.

## Project Description

This project aims to build a modern marketplace experience with:

- Customer shopping flow (browse products, view details, cart, orders, profile)
- Seller onboarding and seller dashboard for product listing management
- Admin tools for marketplace operations (users, orders, products, categories, coupons)
- Delivery queue workflow for logistics handling
- Support tools for tickets and order lookup

The frontend is built as a responsive React application with reusable UI components, while the backend exposes REST APIs for authentication, product management, seller operations, image upload integration, and admin controls.

## Current Development Status

This repository is under active development, so features, routes, and UI behavior may continue to change as modules are completed and refined.

## Tech Stack

- Frontend: React + TypeScript + Vite + Tailwind CSS + Redux Toolkit
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL with Drizzle ORM
- Auth and security: JWT-based authentication with refresh token flow
- Media: Cloudinary integration for product image handling

## Project Structure

- `client/`: Frontend application (multi-role UI, pages, reusable components, API integration)
- `server/`: Backend API, feature modules, middleware, database and seeding scripts

## API Scope (Current)

The server currently exposes versioned API routes under `/api/v1` including:

- `/auth`
- `/products`
- `/cloudinary`
- `/seller`
- `/admin`

## Local Setup

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd Druk-E-Com
```

### 2. Start Backend

```bash
cd server
pnpm install
pnpm dev
```

### 3. Start Frontend

Open another terminal:

```bash
cd client
pnpm install
pnpm dev
```

By default, the frontend calls backend APIs at `http://localhost:5050/api/v1`.

## Vision

Druk-E-Com is being built to become a practical, scalable marketplace foundation with clear separation of concerns across business roles and maintainable full-stack architecture.