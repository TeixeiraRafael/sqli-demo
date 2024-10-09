import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import '../styles/Sidebar.css'

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (
        <div className="d-flex flex-column vh-100 sidebar">
            <h2 className="text-center my-3">ExpensesView</h2>
            <Nav className="flex-column">
                <Nav.Link as={Link} className='sidebar-link' to="/">Home</Nav.Link>
                <Nav.Link as={Link} className='sidebar-link' to="/detailed-view">Detailed View</Nav.Link>
                <Nav.Link as={Link} className='sidebar-link' to="/upload-view">Upload Expenses</Nav.Link>
                <Nav.Link onClick={handleLogout} className='sidebar-link'>Logout</Nav.Link>
            </Nav>
        </div>
    );
};

export default Sidebar;
