import express from "express";
import { googleLogin } from "../controllers/googleAuthController.js";

const router = express.Router();
router.post("/", googleLogin);

router.get('/debug', (req, res) => {
    res.json({
        message: "Google Auth Configuration",
        clientId: process.env.GOOGLE_CLIENT_ID ? "Configured (ends with ...com)" : "Missing",
        clientIdPrefix: process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.substring(0, 10) + "..." : "N/A",
        allowedOrigins: [
            'http://localhost:5173',
            'http://localhost:5176',
            'http://127.0.0.1:5173',
            'https://citriq.vercel.app'
        ]
    });
});

export default router;
