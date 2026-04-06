import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as authSchema from '../../features/auth/models/index.js';
import * as productSchema from '../../features/product/models/index.js';
import * as sellerSchema from '../../features/seller/models/index.js';

const DATABASE_URL= process.env.DATABASE_URL

if (!DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in environment variables');
}

const pool = new Pool({ connectionString: DATABASE_URL });

// Merge all schemas
const schema = {
    ...authSchema,
    ...productSchema,
    ...sellerSchema,
};

export const db = drizzle(pool, { schema });

export async function checkDbConnection() {
    try {
        await db.execute('SELECT 1');
        console.log("Database connection successful");
        return true;
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    }
}
