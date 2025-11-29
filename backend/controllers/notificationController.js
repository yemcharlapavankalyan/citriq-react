/* eslint-env node */
import { pool } from "../db.js";

// Get notifications for a user
export async function getNotifications(req, res) {
    try {
        const userId = req.user.id;
        const result = await pool.query(
            "SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC",
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Server error fetching notifications" });
    }
}

// Mark notification as read
export async function markAsRead(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const result = await pool.query(
            "UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2 RETURNING *",
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({ message: "Server error" });
    }
}

// Create a notification (Internal use mostly)
export async function createNotification(userId, message) {
    try {
        await pool.query(
            "INSERT INTO notifications (user_id, message) VALUES ($1, $2)",
            [userId, message]
        );
    } catch (error) {
        console.error("Error creating notification:", error);
    }
}
