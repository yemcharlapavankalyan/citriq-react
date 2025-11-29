// Google OAuth Configuration
// This file centralizes all Google OAuth settings

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Allowed origins for development and production
// These must match exactly what is in the Google Cloud Console
export const ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:5176',
    'http://127.0.0.1:5173',
    'https://citriq.vercel.app'
];

export const checkOrigin = () => {
    const currentOrigin = window.location.origin;
    const isAllowed = ALLOWED_ORIGINS.includes(currentOrigin);

    if (!isAllowed) {
        console.warn(`Current origin ${currentOrigin} is not in the allowed list. Google Login may fail.`);
        console.warn('Please add this origin to your Google Cloud Console "Authorized JavaScript origins".');
    }

    return isAllowed;
};
