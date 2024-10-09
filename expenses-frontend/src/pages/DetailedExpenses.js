import React from 'react';
import { Row } from 'react-bootstrap';

import Sidebar from '../components/Sidebar';
import ExpensesList from '../components/ExpensesList';

import '../styles/DetailedExpenses.css'

const DetailedExpenses = () => {
    return (
        <div className="d-flex">
            <Sidebar />
            <div className="container text-center flex-grow-1 detailed-expenses">
                <Row className="justify-content-center mb-4">
                    <ExpensesList />
                </Row>
            </div>
        </div>
    );
};

export default DetailedExpenses;