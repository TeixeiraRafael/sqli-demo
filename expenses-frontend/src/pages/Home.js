import React from 'react';
import { Row } from 'react-bootstrap';

import Sidebar from '../components/Sidebar';
import ExpensesGraph from '../components/ExpensesGraph';

const Home = () => {
    return (
        <div className="d-flex">
            <Sidebar />
            <div className="container text-center flex-grow-1">
                <Row className="justify-content-center mb-4">
                    <ExpensesGraph />
                </Row>
            </div>
        </div>
    );
};

export default Home;