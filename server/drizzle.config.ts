import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    // Folder where Drizzle will output migration files
    out: 'src/shared/database/migrations',

    // Paths to all your schema files
    schema: [
        'src/features/auth/models/*.ts',
        'src/features/product/models/*.ts',
        'src/features/seller/models/*.ts',
    ],

    // Database dialect (PostgreSQL)
    dialect: 'postgresql',

    // Connection to your Docker PostgreSQL
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
