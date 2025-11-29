import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { checkOrigin } from '../config/googleAuth';

const GoogleLoginButton = ({ onError }) => {
    const { login } = useApp();
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse) => {
        try {
            // Check if origin is allowed (warns in console if not)
            checkOrigin();

            // Send Google token to backend
            const response = await fetch('http://localhost:5001/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: credentialResponse.credential
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Create user object from backend response
                const user = {
                    id: data.user?.id || Date.now(),
                    name: data.name,
                    email: data.email,
                    role: data.role,
                    token: data.token // Store JWT token
                };

                // Store in localStorage for persistence
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(user));

                login(user);
                navigate('/dashboard');
            } else {
                if (onError) onError(data.message || 'Google login failed');
            }
        } catch (err) {
            console.error('Google login error:', err);
            if (onError) onError('Failed to connect to server');
        }
    };

    const handleError = () => {
        if (onError) onError('Google login failed. Please try again.');
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                useOneTap
                theme="outline"
                size="large"
                text="continue_with"
                width="350" // Fixed width in pixels as recommended
            />
        </div>
    );
};

export default GoogleLoginButton;
