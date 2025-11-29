/* eslint-env node */
import { pool } from "../db.js";

// Create a new submission
export async function createSubmission(req, res) {
    try {
        const { title, description, taskId } = req.body;
        const userId = req.user.id; // From verifyToken middleware
        const filePath = req.file ? req.file.path : null;

        if (!title || !taskId || !filePath) {
            return res.status(400).json({ message: "Title, Task ID, and File are required" });
        }

        const result = await pool.query(
            `INSERT INTO submissions (user_id, task_id, title, description, file_path, status) 
             VALUES ($1, $2, $3, $4, $5, 'pending') 
             RETURNING *`,
            [userId, taskId, title, description, filePath]
        );

        res.status(201).json({
            message: "Submission created successfully",
            submission: result.rows[0]
        });
    } catch (error) {
        console.error("Error creating submission:", error);
        res.status(500).json({ message: "Server error creating submission" });
    }
}

// Get all submissions (with filters)
export async function getSubmissions(req, res) {
    try {
        const { taskId, userId, status } = req.query;
        let query = `
            SELECT s.*, u.name as student_name, t.title as task_title 
            FROM submissions s
            JOIN users u ON s.user_id = u.id
            JOIN review_tasks t ON s.task_id = t.id
            WHERE 1=1
        `;
        const params = [];
        let paramCount = 1;

        if (taskId) {
            query += ` AND s.task_id = $${paramCount}`;
            params.push(taskId);
            paramCount++;
        }

        if (userId) {
            query += ` AND s.user_id = $${paramCount}`;
            params.push(userId);
            paramCount++;
        }

        if (status) {
            query += ` AND s.status = $${paramCount}`;
            params.push(status);
            paramCount++;
        }

        query += ` ORDER BY s.submitted_at DESC`;

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching submissions:", error);
        res.status(500).json({ message: "Server error fetching submissions" });
    }
}

// Get submission by ID
export async function getSubmissionById(req, res) {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT s.*, u.name as student_name, t.title as task_title 
             FROM submissions s
             JOIN users u ON s.user_id = u.id
             JOIN review_tasks t ON s.task_id = t.id
             WHERE s.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Submission not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching submission:", error);
        res.status(500).json({ message: "Server error fetching submission" });
    }
}

// Update submission status
export async function updateSubmissionStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'assigned', 'reviewed'].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const result = await pool.query(
            "UPDATE submissions SET status = $1 WHERE id = $2 RETURNING *",
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Submission not found" });
        }

        res.json({
            message: "Submission status updated",
            submission: result.rows[0]
        });
    } catch (error) {
        console.error("Error updating submission status:", error);
        res.status(500).json({ message: "Server error updating submission status" });
    }
}
