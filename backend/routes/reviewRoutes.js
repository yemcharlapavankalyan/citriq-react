/* eslint-env node */
import express from "express";
import {
    assignReviewer,
    submitReview,
    getMyAssignedReviews,
    getMyReceivedReviews
} from "../controllers/reviewController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/assign", verifyToken, assignReviewer); // Admin/Teacher only (should add role check)
router.put("/:id", verifyToken, submitReview);
router.get("/assigned", verifyToken, getMyAssignedReviews);
router.get("/received", verifyToken, getMyReceivedReviews);

export default router;
