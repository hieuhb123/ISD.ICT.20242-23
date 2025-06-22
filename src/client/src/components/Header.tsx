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
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-house-door" viewBox="0 0 16 16">
                                        <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z"></path>
                                        </svg>
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
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-cart" viewBox="0 0 16 16">
                                        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                                        </svg>
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
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-table" viewBox="0 0 16 16">
                                        <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 2h-4v3h4zm0 4h-4v3h4zm0 4h-4v3h3a1 1 0 0 0 1-1zm-5 3v-3H6v3zm-5 0v-3H1v2a1 1 0 0 0 1 1zm-4-4h4V8H1zm0-4h4V4H1zm5-3v3h4V4zm4 4H6v3h4z"/>
                                        </svg>
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