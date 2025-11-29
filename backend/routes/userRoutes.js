/* eslint-env node */
import express from "express";
import { getAllUsers, createUser, registerUser } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/register", registerUser);
router.post("/", verifyToken, createUser);

export default router;
