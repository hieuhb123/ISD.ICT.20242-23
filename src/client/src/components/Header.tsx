import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logoshop.png';
import { NavLink } from 'react-router-dom';

const App: React.FC = () => {
    return (
        <header>
            <div className="px-3 py-2 text-bg-dark border-bottom">
                <div className="container">
                    <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start"> 
                            <Link to="/" className="d-flex align-items-center my-2 my-lg-0 me-lg-auto text-white text-decoration-none">
                                <img src={logo} alt="Logo" height={40} />
                            </Link>
                        <ul className="nav col-12 col-lg-auto my-2 justify-content-center my-md-0 text-small">
                            <li> 
                                <NavLink
                                    to="/"
                                    className={({ isActive }) =>
                                        'nav-link text-white' + (isActive ? ' disabled opacity-50' : '')
                                    }> 
                                    <svg className="bi d-block mx-auto mb-1" width="24"
                                        height="24" aria-hidden="true">
                                    </svg>
                                    Home
                                </NavLink> 
                            </li>
                            <li>
                                <NavLink
                                    to="/cart"
                                    className={({ isActive }) =>
                                        'nav-link text-white' + (isActive ? ' disabled opacity-50' : '')
                                    }
                                >
                                    <svg className="bi d-block mx-auto mb-1" width="24" height="24" aria-hidden="true">
                                        {/* Cart icon SVG */}
                                    </svg>
                                    View Cart
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/vieworder"
                                    className={({ isActive }) =>
                                        'nav-link text-white' + (isActive ? ' disabled opacity-50' : '')
                                    }
                                >
                                    <svg className="bi d-block mx-auto mb-1" width="24" height="24" aria-hidden="true">
                                        {/* Order icon SVG */}
                                    </svg>
                                    View Order
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="px-3 py-2 border-bottom mb-3">
                <div className="container d-flex flex-wrap justify-content-center">
                    <form className="col-12 col-lg-auto mb-2 mb-lg-0 me-lg-auto" role="search"> 
                        <input type="search" className="form-control" placeholder="Search..." aria-label="Search" /> 
                    </form>
                    <div className="text-end"> 
                        <Link to="/login" className="btn btn-light text-dark me-2">Login</Link>
                        <button type="button" className="btn btn-primary">Sign-up</button> 
                    </div>
                </div>
            </div>
        </header>
    );
};

export default App;