/* eslint-env node */
import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const connectionString = process.env.DATABASE_URL;

const config = connectionString
    ? {
        connectionString,
        ssl: {
            rejectUnauthorized: false // Required for Neon/AWS RDS
        }
    }
    : {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    };

if (connectionString) {
    console.log("Using DATABASE_URL:", connectionString.replace(/:[^:@]+@/, ":****@"));
} else {
    console.log("Using local DB config");
}

export const pool = new Pool(config);
