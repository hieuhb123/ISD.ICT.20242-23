import React, { useState, useEffect } from 'react';
import { ProductManager } from '../types';

interface CreateUserForm {
    username: string;
    password: string;
}

interface ChangePasswordForm {
    userId: string;
    currentPassword: string;
    newPassword: string;
}

const Admin: React.FC = () => {
    const [users, setUsers] = useState<ProductManager[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
    
    // Form states
    const [createForm, setCreateForm] = useState<CreateUserForm>({
        username: '',
        password: ''
    });
    
    const [changePasswordForm, setChangePasswordForm] = useState<ChangePasswordForm>({
        userId: '',
        currentPassword: '',
        newPassword: ''
    });

    // Fetch all users
    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/admin/all');
            const data = await res.json();
            if (data.code === 1) {
                setUsers(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Create new user
    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:8080/api/admin/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(createForm)
            });
            
            const data = await res.json();
            if (data.code === 1) {
                alert('User created successfully!');
                setCreateForm({ username: '', password: '' });
                setShowCreateForm(false);
                fetchUsers(); // Refresh user list
            } else {
                alert('Failed to create user: ' + data.message);
            }
        } catch (error) {
            alert('Error creating user');
        }
    };

    // Delete user
// Delete user
    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        
        try {
            const res = await fetch(`http://localhost:8080/api/admin/delete?userId=${userId}`, {
                method: 'DELETE'
            });
            
            const data = await res.json();
            if (data.code === 1) {
                alert('User deleted successfully!');
                fetchUsers(); // Refresh user list
            } else {
                alert('Failed to delete user: ' + data.message);
            }
        } catch (error) {
            alert('Error deleting user');
        }
    };

    // Change password
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const params = new URLSearchParams({
                userId: changePasswordForm.userId,
                currentPassword: changePasswordForm.currentPassword,
                newPassword: changePasswordForm.newPassword
            });
            
            const res = await fetch(`http://localhost:8080/api/admin/change-password?${params}`, {
                method: 'PUT'
            });
            
            const data = await res.json();
            if (data.code === 1) {
                alert('Password changed successfully!');
                setChangePasswordForm({ userId: '', currentPassword: '', newPassword: '' });
                setShowChangePasswordForm(false);
            } else {
                alert('Failed to change password: ' + data.message);
            }
        } catch (error) {
            alert('Error changing password');
        }
    };

    if (loading) return <div className="text-center py-4">Loading...</div>;

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Admin Panel - User Management</h2>
                <button 
                    className="btn btn-primary"
                    onClick={() => setShowCreateForm(true)}
                >
                    Create New User
                </button>
            </div>

            {/* Users Table */}
            <div className="card">
                <div className="card-header">
                    <h5 className="mb-0">Product Managers ({users.length})</h5>
                </div>
                <div className="card-body">
                    {users.length === 0 ? (
                        <p className="text-muted">No users found.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Username</th>
                                        <th>Created At</th>
                                        <th>Products Count</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td><code>{user.id}</code></td>
                                            <td>
                                                <strong>{user.username}</strong>
                                            </td>
                                            <td>
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td>
                                                <span className="badge bg-info">
                                                    {user.ownProductIds?.length || 0} products
                                                </span>
                                            </td>
                                            <td>
                                                <div className="btn-group btn-group-sm">
                                                    <button 
                                                        className="btn btn-outline-warning"
                                                        onClick={() => {
                                                            setChangePasswordForm(prev => ({ ...prev, userId: user.id }));
                                                            setShowChangePasswordForm(true);
                                                        }}
                                                    >
                                                        Change Password
                                                    </button>
                                                    <button 
                                                        className="btn btn-outline-danger"
                                                        onClick={() => handleDeleteUser(user.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Create User Modal */}
            {showCreateForm && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Create New User</h5>
                                <button 
                                    type="button" 
                                    className="btn-close"
                                    onClick={() => setShowCreateForm(false)}
                                ></button>
                            </div>
                            <form onSubmit={handleCreateUser}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Username *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={createForm.username}
                                            onChange={e => setCreateForm(prev => ({ ...prev, username: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Password *</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={createForm.password}
                                            onChange={e => setCreateForm(prev => ({ ...prev, password: e.target.value }))}
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowCreateForm(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Create User
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {showChangePasswordForm && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Change Password</h5>
                                <button 
                                    type="button" 
                                    className="btn-close"
                                    onClick={() => setShowChangePasswordForm(false)}
                                ></button>
                            </div>
                            <form onSubmit={handleChangePassword}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">User ID</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={changePasswordForm.userId}
                                            onChange={e => setChangePasswordForm(prev => ({ ...prev, userId: e.target.value }))}
                                            required
                                            readOnly
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Current Password *</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={changePasswordForm.currentPassword}
                                            onChange={e => setChangePasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">New Password *</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={changePasswordForm.newPassword}
                                            onChange={e => setChangePasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowChangePasswordForm(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-warning">
                                        Change Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;