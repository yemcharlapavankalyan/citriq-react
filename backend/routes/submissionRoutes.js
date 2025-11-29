/* eslint-env node */
import express from "express";
import {
    createSubmission,
    getSubmissions,
    getSubmissionById,
    updateSubmissionStatus
} from "../controllers/submissionController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, upload.single("file"), createSubmission);
router.get("/", verifyToken, getSubmissions);
router.get("/:id", verifyToken, getSubmissionById);
router.put("/:id/status", verifyToken, updateSubmissionStatus);

export default router;
