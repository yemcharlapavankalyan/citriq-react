/* eslint-env node */
import { pool } from "../db.js";
import { createNotification } from "./notificationController.js";

// Assign a reviewer to a submission
export async function assignReviewer(req, res) {
    try {
        const { submissionId, reviewerId } = req.body;

        // Check if assignment already exists
        const existing = await pool.query(
            "SELECT id FROM peer_reviews WHERE submission_id = $1 AND reviewer_id = $2",
            [submissionId, reviewerId]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({ message: "Reviewer already assigned to this submission" });
        }

        const result = await pool.query(
            "INSERT INTO peer_reviews (submission_id, reviewer_id) VALUES ($1, $2) RETURNING *",
            [submissionId, reviewerId]
        );

        // Update submission status
        await pool.query("UPDATE submissions SET status = 'assigned' WHERE id = $1", [submissionId]);

        // Notify reviewer
        await createNotification(reviewerId, "You have been assigned a new peer review.");

        res.status(201).json({ message: "Reviewer assigned successfully", assignment: result.rows[0] });
    } catch (error) {
        console.error("Error assigning reviewer:", error);
        res.status(500).json({ message: "Server error assigning reviewer" });
    }
}

// Submit a review
export async function submitReview(req, res) {
    try {
        const { id } = req.params; // review id
        const { rating, comments } = req.body;
        const reviewerId = req.user.id;

        const result = await pool.query(
            `UPDATE peer_reviews 
             SET rating = $1, comments = $2, reviewed_at = NOW() 
             WHERE id = $3 AND reviewer_id = $4 
             RETURNING *`,
            [rating, comments, id, reviewerId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Review assignment not found or unauthorized" });
        }

        // Get submission details to notify student
        const review = result.rows[0];
        const submission = await pool.query("SELECT user_id FROM submissions WHERE id = $1", [review.submission_id]);

        if (submission.rows.length > 0) {
            await createNotification(submission.rows[0].user_id, "You have received a new peer review.");
        }

        res.json({ message: "Review submitted successfully", review: result.rows[0] });
    } catch (error) {
        console.error("Error submitting review:", error);
        res.status(500).json({ message: "Server error submitting review" });
    }
}

// Get reviews assigned to me (as a reviewer)
export async function getMyAssignedReviews(req, res) {
    try {
        const userId = req.user.id;
        const result = await pool.query(
            `SELECT pr.*, s.title as submission_title, s.file_path, u.name as student_name
             FROM peer_reviews pr
             JOIN submissions s ON pr.submission_id = s.id
             JOIN users u ON s.user_id = u.id
             WHERE pr.reviewer_id = $1`,
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching assigned reviews:", error);
        res.status(500).json({ message: "Server error" });
    }
}

// Get reviews received (as a student)
export async function getMyReceivedReviews(req, res) {
    try {
        const userId = req.user.id;
        const result = await pool.query(
            `SELECT pr.*, u.name as reviewer_name, s.title as submission_title
             FROM peer_reviews pr
             JOIN submissions s ON pr.submission_id = s.id
             JOIN users u ON pr.reviewer_id = u.id
             WHERE s.user_id = $1 AND pr.rating IS NOT NULL`,
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching received reviews:", error);
        res.status(500).json({ message: "Server error" });
    }
}
