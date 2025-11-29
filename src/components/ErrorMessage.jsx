import React from 'react';

const ErrorMessage = ({ error, onDismiss }) => {
  if (!error) return null;

  return (
    <div className="alert alert-error" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center' 
    }}>
      <div>
        <strong>Error:</strong> {error}
      </div>
      {onDismiss && (
        <button 
          onClick={onDismiss}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'inherit', 
            cursor: 'pointer',
            fontSize: '1.2rem',
            padding: '0.25rem 0.5rem'
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;

