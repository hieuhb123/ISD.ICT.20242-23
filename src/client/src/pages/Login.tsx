import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { User } from '../types';
import { useAuth } from '../contexts/AuthContext'; 

import hust from '../assets/hust.png';
const Login: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('pm');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const isMountedRef = useRef(true);

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            let url = '';
            if (role === 'pm') {
                url = 'http://localhost:8080/api/ProductManager/login';
            } else if (role === 'admin') {
                url = 'http://localhost:8080/api/admin/login';
            }

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: email,
                    password: password
                }),
            });

            const data = await res.json();

            if (isMountedRef.current) {
                if (res.ok && data.code === 1 && data.data) {
                    
                    // Tạo user object dựa trên role
                    const userToLogin: User = {
                        id: data.data.id,
                        name: data.data.username,
                        role: role === 'admin' ? 'Admin' : 'Product Manager'
                    };
                    
                    login(userToLogin);
                    
                    // Redirect dựa trên role
                    if (role === 'admin') {
                        navigate('/admin');
                    } else {
                        navigate('/api/ProductManager/list-product');
                    }

                } else {
                    setError(data.message || 'Login failed');
                }
            }
        } catch (err) {
            if (isMountedRef.current) {
                setError('Login failed. Please check your connection.');
            }
        } finally {
            if (isMountedRef.current) {
                setIsLoading(false);
            }
        }
    };

    return (
        <main className="form-signin w-100 m-auto" style={{ maxWidth: 330, padding: '1rem' }}>
            <form onSubmit={handleSubmit}>
                <img className="mb-4" src={hust} alt="ảnh bách khoa" width="72" height="108" />
                <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

                <div className="form-floating mb-2">
                    <input
                        type="text"
                        className="form-control"
                        id="floatingInput"
                        placeholder="Username"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                    <label htmlFor="floatingInput">Username</label>
                </div>
                
                <div className="form-floating mb-2">
                    <input
                        type="password"
                        className="form-control"
                        id="floatingPassword"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                    <label htmlFor="floatingPassword">Password</label>
                </div>
                                <div className="list-group mb-3">
                    <label className="list-group-item d-flex gap-2">
                        <input
                            className="form-check-input flex-shrink-0"
                            type="radio"
                            name="listGroupRadios"
                            id="product_manager"
                            value="pm"
                            checked={role === 'pm'}
                            onChange={() => setRole('pm')}
                            disabled={isLoading}
                        />
                        <span>Product Manager</span>
                    </label>
                    <label className="list-group-item d-flex gap-2">
                        <input
                            className="form-check-input flex-shrink-0"
                            type="radio"
                            name="listGroupRadios"
                            id="admin"
                            value="admin"
                            checked={role === 'admin'}
                            onChange={() => setRole('admin')}
                            disabled={isLoading}
                        />
                        <span>Admin</span>
                    </label>
                </div>

                <button className="btn btn-primary w-100 py-2" type="submit" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : `Sign in as ${role === 'admin' ? 'Admin' : 'Product Manager'}`}
                </button>
                <div className="text-center mt-3">
                    <Link to="/signup" className="text-decoration-none">
                        Don't have an account? Sign up
                    </Link>
                </div>
                
                {error && <div className="alert alert-danger py-1 mt-2">{error}</div>}
            </form>
        </main>
    );
};

export default Login;
