/* eslint-env node */
import fs from "fs";
import path from "path";
import { pool } from "./db.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDb() {
    try {
        const schemaPath = path.join(__dirname, "sql", "schema.sql");
        const schemaSql = fs.readFileSync(schemaPath, "utf8");

        console.log("Running schema.sql...");
        await pool.query(schemaSql);
        console.log("Database initialized successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Error initializing database:", error);
        process.exit(1);
    }
}

initDb();
