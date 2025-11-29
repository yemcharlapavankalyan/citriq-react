import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="loading">
      <div className="spinner"></div>
      <p style={{ marginTop: '1rem', color: '#667eea' }}>{message}</p>
    </div>
  );
};

export default LoadingSpinner;

