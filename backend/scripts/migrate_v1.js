/* eslint-env node */
import { pool } from "../db.js";

async function migrate() {
    try {
        console.log("Starting migration...");

        // Add created_by to review_tasks
        try {
            await pool.query("ALTER TABLE review_tasks ADD COLUMN created_by INT REFERENCES users(id)");
            console.log("Added created_by to review_tasks");
        } catch (e) {
            console.log("Column created_by might already exist in review_tasks");
        }

        // Add title, description, status to submissions
        try {
            await pool.query("ALTER TABLE submissions ADD COLUMN title VARCHAR(255)");
            console.log("Added title to submissions");
        } catch (e) { }

        try {
            await pool.query("ALTER TABLE submissions ADD COLUMN description TEXT");
            console.log("Added description to submissions");
        } catch (e) { }

        try {
            await pool.query("ALTER TABLE submissions ADD COLUMN status VARCHAR(20) DEFAULT 'pending'");
            console.log("Added status to submissions");
        } catch (e) { }

        // Create comments table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS comments (
                id SERIAL PRIMARY KEY,
                submission_id INT REFERENCES submissions(id),
                user_id INT REFERENCES users(id),
                content TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);
        console.log("Created comments table");

        console.log("Migration completed successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migrate();
