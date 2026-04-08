# Druk-E-Com Development Guide

## Project Overview

Druk-E-Com is a full-stack, role-based e-commerce marketplace supporting customers, sellers, admins, delivery staff, and support team members. Each role has dedicated workflows and UI experiences within a unified platform.

## Build & Run Commands

### Frontend (Client)

```bash
cd client
pnpm install          # Install dependencies
pnpm dev              # Start dev server (Vite)
pnpm build            # Build for production (TypeScript + Vite)
pnpm lint             # Run ESLint
pnpm preview          # Preview production build
```

### Backend (Server)

```bash
cd server
pnpm install          # Install dependencies
pnpm dev              # Start dev server (TypeScript watch + nodemon)
pnpm build            # Compile TypeScript
pnpm start            # Start production server
```

### Database Commands

```bash
cd server
pnpm db:generate      # Generate Drizzle migrations
pnpm db:push          # Push schema changes to database
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open Drizzle Studio
pnpm db:seed          # Seed database with test data
```

## Architecture

### Monorepo Structure

- **`client/`**: React frontend with multi-role UIs
- **`server/`**: Express backend with feature-based modules

### Backend: Feature-Based Modules

The server follows a **feature-based architecture** where each business domain is organized as a self-contained module:

```
server/src/features/
├── auth/           # User authentication and JWT management
│   ├── controllers/
│   ├── models/     # Drizzle ORM schema
│   ├── routes/
│   ├── schemas/    # Zod validation schemas
│   └── services/
├── product/        # Product catalog and image upload
├── seller/         # Seller onboarding and management
└── admin/          # Admin operations (users, orders, etc.)
```

**Key principle**: Each feature is responsible for its own routes, controllers, services, models, and validation schemas. Shared utilities live in `server/src/shared/`.

### Backend: Shared Infrastructure

```
server/src/shared/
├── config/             # Environment and app config
├── constants/          # HTTP status codes, error codes
├── database/           # DB connection, migrations, seeders
├── errors/             # Custom error classes (BadRequestException, etc.)
├── middlewares/        # Reusable middleware (auth, validation, etc.)
├── services/           # Cloudinary, external integrations
├── types/              # Shared TypeScript types
└── utils/              # Helper functions (asyncWrapper, etc.)
```

### Frontend: Multi-Role Architecture

```
client/src/
├── pages/              # Page components organized by role
│   ├── admin/
│   ├── customer/
│   ├── delivery/
│   ├── seller/
│   └── support/
├── components/         # Reusable UI components (shadcn/ui + custom)
├── apis/               # API client layer (axios with interceptors)
├── redux/              # Redux Toolkit state management
├── schemas/            # Zod validation schemas (forms)
├── helpers/            # Utility functions
└── config.ts           # Site-wide configuration (landing page content)
```

### API Routes

All backend routes are versioned under `/api/v1`:

- `/api/v1/auth` - Sign-up, sign-in, token refresh
- `/api/v1/products` - Product CRUD operations
- `/api/v1/cloudinary` - Image upload to Cloudinary
- `/api/v1/seller` - Seller-specific operations
- `/api/v1/admin` - Admin operations (seller approval, etc.)

### Authentication Flow

**JWT-based authentication with refresh tokens:**

1. **Sign-in**: Returns `accessToken` (short-lived) and `refreshToken` (HTTP-only cookie)
2. **API requests**: Include `Authorization: Bearer <accessToken>` header
3. **Token expiry**: Axios interceptor automatically calls `/auth/refresh-token` and retries failed request
4. **Logout/Invalid token**: Redux state reset and redirect to `/auth`

**Server-side middleware:**
- `authenticate`: Verifies JWT in `Authorization` header, attaches `req.user`
- `role`: Checks if `req.user.roles` includes required role(s)
- `permission`: Checks if `req.user.permissions` includes required permission(s)

**Client-side token management:**
- `axiosInstance` in `client/src/apis/index.ts` handles token injection and refresh logic
- Redux store holds user state (`isAuthenticated`, `accessToken`, `user`)
- Access token stored in `localStorage` for persistence

## Key Conventions

### Validation

- **Server**: Use Zod schemas in `<feature>/schemas/` validated via `validator` middleware
- **Client**: Use Zod schemas in `client/src/schemas/` with `react-hook-form` + `@hookform/resolvers`

### Error Handling

**Server**: Throw custom error classes from `shared/errors/error.core.js`:
- `BadRequestException` (400)
- `UnAuthorizedException` (401)
- `ForbiddenException` (403)
- `NotFoundException` (404)
- `InternalServerError` (500)

These are caught by `global-error-handler` middleware and formatted into consistent JSON responses.

**Client**: Axios interceptor displays errors via `toast.error()` (Sonner).

### Route Controllers

Wrap all controller methods with `asyncWrapper` to avoid try-catch boilerplate:

```typescript
import asyncWrapper from "../../../shared/utils/asyncWrapper.js";

authRoute.post("/sign-in", 
  validator({ body: SignInSchema }), 
  asyncWrapper(authController.signIn)
);
```

### Database Models

- **ORM**: Drizzle ORM with PostgreSQL
- **Schema location**: `<feature>/models/*.ts`
- **Migration output**: `server/src/shared/database/migrations/`
- **Config**: `server/drizzle.config.ts` (lists all schema paths)

**Adding a new model:**
1. Create schema in `src/features/<feature>/models/<model>.ts`
2. Add schema path to `drizzle.config.ts`
3. Run `pnpm db:generate` to create migration
4. Run `pnpm db:push` or `pnpm db:migrate`

### Client-Side Data Fetching

- **State management**: Redux Toolkit (`client/src/redux/`)
- **API calls**: Centralized in `client/src/apis/` (one file per domain: `authApi.ts`, `productsApi.ts`, etc.)
- **Pattern**: Export named functions that return axios promises

Example:
```typescript
// client/src/apis/authApi.ts
export const signIn = (credentials: SignInData) => {
  return axiosInstance.post("/auth/sign-in", credentials);
};
```

### UI Components

- **Component library**: shadcn/ui (Radix UI primitives + Tailwind)
- **Location**: `client/src/components/`
- **Installation**: Use `pnpm dlx shadcn@latest add <component>` to add new components
- **Styling**: Tailwind CSS with custom animations for scroll effects (GSAP)

### Landing Page Content

All landing page content is **centralized in `client/src/config.ts`**. Edit this file to update navigation, hero, product showcase, footer, etc. Components automatically hide when config values are empty.

### File Extensions

- **Server**: Use `.js` extension in imports even for TypeScript files (required for ES modules)
  ```typescript
  import asyncWrapper from "../../../shared/utils/asyncWrapper.js";
  ```
- **Client**: Standard TypeScript imports (`.ts`/`.tsx` omitted)

## Common Tasks

### Adding a New API Route

1. Create feature module structure in `server/src/features/<feature>/`
2. Define Drizzle schema in `models/`
3. Create Zod schemas in `schemas/`
4. Write service logic in `services/`
5. Create controller in `controllers/`
6. Define routes in `routes/<feature>.route.ts`
7. Register routes in `server/src/routes/index.ts`

### Adding a New Frontend Page

1. Create page component in `client/src/pages/<role>/<page>.tsx`
2. Add route in `client/src/App.tsx` (or router config)
3. Create API client functions in `client/src/apis/<domain>Api.ts`
4. Add Redux slice if complex state management needed
5. Create/reuse UI components from `client/src/components/`

### Database Seeding

Run `pnpm db:seed` to populate the database with test data. Seed script is located at `server/src/shared/database/seeders/seed.ts`.

## Development Notes

- **Active development**: Features, routes, and UI are still evolving
- **Package manager**: pnpm (see `pnpm-workspace.yaml` in both client and server)
- **Default ports**: Client runs on Vite default (usually 5173), server on 5050
- **CORS**: Server accepts requests from `process.env.CLIENT_URL` (defaults to `*` if not set)
- **Docker**: `docker-compose.yml` exists in `server/` for PostgreSQL setup
