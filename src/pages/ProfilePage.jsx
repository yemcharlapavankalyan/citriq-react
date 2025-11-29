import React from 'react';
import { useApp } from '../context/AppContext';

const ProfilePage = () => {
    const { user } = useApp();

    if (!user) return <div>Loading...</div>;

    return (
        <div className="container" style={{ padding: '2rem' }}>
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h1 className="card-title">My Profile</h1>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            backgroundColor: '#3182ce',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                            fontWeight: 'bold'
                        }}>
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 style={{ margin: 0 }}>{user.name}</h2>
                            <span style={{
                                display: 'inline-block',
                                padding: '0.25rem 0.75rem',
                                backgroundColor: user.role === 'teacher' ? '#805ad5' : '#38a169',
                                color: 'white',
                                borderRadius: '9999px',
                                fontSize: '0.875rem',
                                marginTop: '0.5rem'
                            }}>
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-input"
                                value={user.email}
                                disabled
                                style={{ backgroundColor: '#f7fafc' }}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">User ID</label>
                            <input
                                type="text"
                                className="form-input"
                                value={user.id}
                                disabled
                                style={{ backgroundColor: '#f7fafc' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
