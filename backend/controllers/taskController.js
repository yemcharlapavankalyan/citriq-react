/* eslint-env node */
import { pool } from "../db.js";

// Create a new review task (project)
export async function createTask(req, res) {
    try {
        const { title, description, dueDate, assignedStudents } = req.body;
        const createdBy = req.user.id;

        // Validate required fields
        if (!title || !dueDate) {
            return res.status(400).json({ message: "Title and Due Date are required" });
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const result = await client.query(
                "INSERT INTO review_tasks (title, description, due_date, created_by) VALUES ($1, $2, $3, $4) RETURNING *",
                [title, description, dueDate, createdBy]
            );

            const task = result.rows[0];

            // Assign students
            if (assignedStudents && Array.isArray(assignedStudents) && assignedStudents.length > 0) {
                for (const studentId of assignedStudents) {
                    await client.query(
                        "INSERT INTO task_assignments (task_id, student_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
                        [task.id, studentId]
                    );
                }
            }

            await client.query('COMMIT');

            // Return task with assigned students count (optional)
            task.assignedCount = assignedStudents ? assignedStudents.length : 0;

            res.status(201).json({ message: "Task created successfully", task });
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ message: "Server error creating task" });
    }
}

// Get all tasks (Admin sees all, Student sees assigned)
export async function getTasks(req, res) {
    try {
        const userId = req.user.id;
        const role = req.user.role;

        let query = "";
        let params = [];

        if (role === 'student') {
            // Students only see tasks assigned to them
            query = `
                SELECT t.*, 
                       (SELECT COUNT(*) FROM submissions s WHERE s.task_id = t.id AND s.user_id = $1) as submission_count,
                       (SELECT status FROM submissions s WHERE s.task_id = t.id AND s.user_id = $1 LIMIT 1) as status
                FROM review_tasks t
                JOIN task_assignments ta ON t.id = ta.task_id
                WHERE ta.student_id = $1
                ORDER BY t.due_date ASC
            `;
            params = [userId];
        } else {
            // Admins/Teachers see all tasks
            // Also fetch assigned students count
            query = `
                SELECT t.*, 
                       (SELECT COUNT(*) FROM task_assignments ta WHERE ta.task_id = t.id) as assigned_count,
                       (SELECT COUNT(*) FROM submissions s WHERE s.task_id = t.id) as submission_count
                FROM review_tasks t
                ORDER BY t.due_date DESC
            `;
        }

        const result = await pool.query(query, params);

        // For students, we map the status to what the frontend expects
        if (role === 'student') {
            const tasks = result.rows.map(row => ({
                ...row,
                status: row.status || 'pending', // pending, submitted
                submissions: [], // Frontend expects this array for filtering count
                reviews: [] // Frontend expects this
            }));
            res.json(tasks);
        } else {
            // For admin, we might need to populate submissions/reviews arrays if the frontend relies on them heavily
            // The current frontend uses `project.submissions.length`.
            // My query returns `submission_count`.
            // I should adapt the response to match frontend expectations or update frontend.
            // The frontend `AdminDashboard` uses:
            // project.submissions.length
            // project.reviews.length
            // project.assignedStudents (array of IDs)

            // Let's fetch the full details for Admin to keep frontend happy, or update frontend.
            // Updating frontend to use `submission_count` is better for performance, but I need to be careful.
            // The frontend `AdminDashboard` has:
            // `project.assignedStudents.includes(...)`

            // I need to return `assignedStudents` array for each project for the Admin Dashboard to show who is assigned.

            const tasks = [];
            for (const row of result.rows) {
                const assignedRes = await pool.query("SELECT student_id FROM task_assignments WHERE task_id = $1", [row.id]);
                const assignedStudents = assignedRes.rows.map(r => r.student_id);

                // We also need submissions for the "View Submissions" modal
                // Actually the modal fetches submissions separately now: `handleViewSubmissions` calls `submissionsAPI.getAll`.
                // But the list view uses `project.submissions.length`.
                // And `project.reviews.length`.

                tasks.push({
                    ...row,
                    assignedStudents: assignedStudents,
                    submissions: new Array(parseInt(row.submission_count || 0)), // Dummy array for length check
                    reviews: [] // Dummy array
                });
            }
            res.json(tasks);
        }
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Server error fetching tasks" });
    }
}

// Get task by ID
export async function getTaskById(req, res) {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM review_tasks WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching task:", error);
        res.status(500).json({ message: "Server error" });
    }
}

// Delete task
export async function deleteTask(req, res) {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM review_tasks WHERE id = $1", [id]);
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: "Server error deleting task" });
    }
}
