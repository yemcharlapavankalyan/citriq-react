/* eslint-env node */
import bcrypt from "bcrypt";
import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

async function createStudent() {
    try {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password123", salt);

        // Insert the student user
        const result = await pool.query(
            "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
            ["Y Pavan Kalyan", "pavan.kalyan@student.edu", hashedPassword, "student"]
        );

        console.log("Student user created successfully:", result.rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            console.log("Student user already exists");
        } else {
            console.error("Error creating student:", error);
        }
    } finally {
        await pool.end();
    }
}

createStudent();
