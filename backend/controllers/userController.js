/* eslint-env node */
import { pool } from "../db.js";
import bcrypt from "bcrypt";

export async function getAllUsers(req, res) {
    try {
        const result = await pool.query(
            "SELECT id, name, email, role FROM users ORDER BY name ASC"
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error fetching users" });
    }
}

// Register a new user (teacher or student) - Public endpoint
export async function registerUser(req, res) {
    try {
        const { name, email, password, role } = req.body;
        // Validate required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required: name, email, password, role' });
        }
        // Validate role
        if (!['student', 'teacher'].includes(role)) {
            return res.status(400).json({ message: "Invalid role. Must be 'student' or 'teacher'" });
        }
        // Check if email already exists
        const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Insert user
        const result = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
            [name, email, hashedPassword, role]
        );
        res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error registering user' });
    }
}

// Create a new user (admin, teacher, student) - Protected endpoint
export async function createUser(req, res) {
    try {
        const { name, email, password, role } = req.body;

        // Validate required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: "All fields are required: name, email, password, role"
            });
        }

        // Validate role
        if (!['student', 'teacher', 'admin'].includes(role)) {
            return res.status(400).json({
                message: "Invalid role. Must be 'student', 'teacher', or 'admin'"
            });
        }

        // Check if email already exists
        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: "A user with this email already exists"
            });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert the new user
        const result = await pool.query(
            "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
            [name, email, hashedPassword, role]
        );

        res.status(201).json({
            message: "User created successfully",
            user: result.rows[0]
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Server error creating user" });
    }
}
