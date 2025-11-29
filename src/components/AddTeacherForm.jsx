import React, { useState } from 'react';

const AddTeacherForm = ({ onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'teacher'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear errors when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5001/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create user');
            }

            setSuccess(`${formData.role === 'teacher' ? 'Teacher' : 'Admin'} created successfully!`);
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'teacher'
            });

            // Call onSuccess callback after a short delay to show success message
            setTimeout(() => {
                if (onSuccess) onSuccess(data.user);
            }, 1500);

        } catch (err) {
            setError(err.message || 'An error occurred while creating the user');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card" style={{ marginBottom: '2rem' }}>
            <h2 className="card-title">Add New Teacher/Admin</h2>

            {error && (
                <div style={{
                    padding: '1rem',
                    marginBottom: '1rem',
                    backgroundColor: '#fee',
                    color: '#c33',
                    borderRadius: '6px',
                    border: '1px solid #fcc'
                }}>
                    {error}
                </div>
            )}

            {success && (
                <div style={{
                    padding: '1rem',
                    marginBottom: '1rem',
                    backgroundColor: '#efe',
                    color: '#3c3',
                    borderRadius: '6px',
                    border: '1px solid #cfc'
                }}>
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                        type="text"
                        name="name"
                        className="form-input"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter full name"
                        required
                        disabled={isSubmitting}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                        type="email"
                        name="email"
                        className="form-input"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                        required
                        disabled={isSubmitting}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Password *</label>
                    <input
                        type="password"
                        name="password"
                        className="form-input"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        required
                        minLength={6}
                        disabled={isSubmitting}
                    />
                    <small style={{ color: '#666', fontSize: '0.875rem' }}>
                        Minimum 6 characters
                    </small>
                </div>

                <div className="form-group">
                    <label className="form-label">Role *</label>
                    <select
                        name="role"
                        className="form-input"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                    >
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating...' : 'Create User'}
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddTeacherForm;
