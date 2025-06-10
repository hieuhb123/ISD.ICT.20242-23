import React, { useState } from 'react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('pm');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Gọi API đăng nhập ở đây
        alert(`Email: ${email}\nPassword: ${password}`);
    };

    return (
        <main className="form-signin w-100 m-auto" style={{ maxWidth: 330, padding: '1rem' }}>
            <form onSubmit={handleSubmit}>
                <img className="mb-4" src="https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo.svg" alt="" width="72" height="57" />
                <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
                <div className="form-floating mb-2">
                    <input
                        type="email"
                        className="form-control"
                        id="floatingInput"
                        placeholder="name@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor="floatingInput">Email address</label>
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
                    />
                    <label htmlFor="floatingPassword">Password</label>
                </div>
                <button className="btn btn-primary w-100 py-2" type="submit">Sign in</button>
                <div className="list-group">
                    <label className="list-group-item d-flex gap-2">
                        <input
                            className="form-check-input flex-shrink-0"
                            type="radio"
                            name="listGroupRadios"
                            id="product_manager"
                            value="pm"
                            checked={role === 'pm'}
                            onChange={() => setRole('pm')}
                        />
                        <span>
                            Product Manager
                        </span>
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
                        />
                        <span>
                            Admin
                        </span>
                    </label>
                </div>
            </form>
        </main>
    );
};

export default Login;