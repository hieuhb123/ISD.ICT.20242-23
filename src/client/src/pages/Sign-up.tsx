import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import hust from '../assets/hust.png';

const SignUp: React.FC = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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

        // Validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (username.length < 3) {
            setError('Username must be at least 3 characters');
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch('http://localhost:8080/api/ProductManager/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username,
                    password: password
                }),
            });

            const data = await res.json();

            if (isMountedRef.current) {
                if (res.ok && data.code === 1) {
                    alert('Product Manager account created successfully! Please login.');
                    navigate('/login');
                } else {
                    setError(data.message || 'Registration failed');
                }
            }
        } catch (err) {
            if (isMountedRef.current) {
                setError('Registration failed. Please check your connection.');
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
                <h1 className="h3 mb-3 fw-normal">Create Product Manager Account</h1>
                
                <div className="form-floating mb-2">
                    <input
                        type="text"
                        className="form-control"
                        id="floatingUsername"
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                    <label htmlFor="floatingUsername">Username</label>
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

                <div className="form-floating mb-3">
                    <input
                        type="password"
                        className="form-control"
                        id="floatingConfirmPassword"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                    <label htmlFor="floatingConfirmPassword">Confirm Password</label>
                </div>

                <button className="btn btn-primary w-100 py-2" type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>

                <div className="text-center mt-3">
                    <Link to="/login" className="text-decoration-none">
                        Already have an account? Sign in
                    </Link>
                </div>

                {error && <div className="alert alert-danger py-1 mt-2">{error}</div>}
            </form>
        </main>
    );
};

export default SignUp;