/* eslint-env node */
import { pool } from "../db.js";

async function migrate() {
    try {
        console.log("Starting migration v2...");

        // Create task_assignments table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS task_assignments (
                id SERIAL PRIMARY KEY,
                task_id INT REFERENCES review_tasks(id) ON DELETE CASCADE,
                student_id INT REFERENCES users(id) ON DELETE CASCADE,
                assigned_at TIMESTAMP DEFAULT NOW(),
                UNIQUE(task_id, student_id)
            )
        `);
        console.log("Created task_assignments table");

        console.log("Migration v2 completed successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Migration v2 failed:", error);
        process.exit(1);
    }
}

migrate();
