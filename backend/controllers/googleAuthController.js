/* eslint-env node */
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import dotenv from "dotenv";
dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function googleLogin(req, res) {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: "Missing Google ID token" });
        }

        // Verify the token
        let ticket;
        try {
            ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
        } catch (error) {
            console.error("Token verification failed:", error.message);
            return res.status(401).json({
                message: "Invalid Google token",
                details: error.message
            });
        }

        const payload = ticket.getPayload();

        // Double check audience (though verifyIdToken does this)
        if (payload.aud !== process.env.GOOGLE_CLIENT_ID) {
            return res.status(401).json({ message: "Token audience mismatch" });
        }

        const { email, name, sub: googleId } = payload;

        // Check if user exists
        const result = await pool.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
        );

        let user;

        if (result.rows.length === 0) {
            // Auto-register Google user
            // Note: In a real app, you might want to store the googleId as well
            const insert = await pool.query(
                "INSERT INTO users (name, email, role, password) VALUES ($1, $2, $3, NULL) RETURNING *",
                [name, email, "student"]
            );
            user = insert.rows[0];
        } else {
            user = result.rows[0];
        }

        const jwtToken = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: "Google login successful",
            token: jwtToken,
            role: user.role,
            email: user.email,
            name: user.name,
            id: user.id
        });

    } catch (err) {
        console.error("Google login error:", err);
        res.status(500).json({ message: "Internal server error during Google login" });
    }
}
