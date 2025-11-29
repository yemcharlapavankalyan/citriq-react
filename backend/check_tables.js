/* eslint-env node */
import { pool } from "./db.js";

async function listTables() {
    try {
        console.log("Connected to database:", process.env.DB_NAME);
        const res = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log("Tables found:", res.rows.map(r => r.table_name));
        process.exit(0);
    } catch (error) {
        console.error("Error listing tables:", error);
        process.exit(1);
    }
}

listTables();
