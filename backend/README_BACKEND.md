# CITRIQ Backend

Node.js + Express backend for CITRIQ.

## 🔐 Google OAuth Setup — Production Ready

To ensure Google Login works correctly and to avoid `origin_mismatch` errors, you must configure your Google Cloud Console exactly as follows:

### 1. Authorized JavaScript Origins
Add **ALL** of these URIs to your OAuth 2.0 Client ID configuration:
- `http://localhost:5173`
- `http://localhost:5176`
- `http://127.0.0.1:5173`
- `https://citriq.vercel.app` (if deploying)

### 2. Authorized Redirect URIs
If you ever enable redirect-based flow, add these:
- `http://localhost:5173/auth/callback`
- `https://citriq.vercel.app/auth/callback`

### 3. Troubleshooting
- **origin_mismatch**: You are running on a port/domain not listed in "Authorized JavaScript Origins". Check the URL bar and update Google Console.
- **invalid_client**: Your `GOOGLE_CLIENT_ID` in `.env` is wrong or deleted.
- **401 Unauthorized**: The token sent to backend was invalid or expired.

## Setup

1.  Install dependencies: `npm install`
2.  Configure `.env` with your database credentials.
3.  Run server: `npm run dev`
