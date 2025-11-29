/* eslint-env node */
import express from "express";
import { createTask, getTasks, getTaskById, deleteTask } from "../controllers/taskController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createTask);
router.get("/", verifyToken, getTasks);
router.get("/:id", verifyToken, getTaskById);
router.delete("/:id", verifyToken, deleteTask);

export default router;
