import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import axiosInstance from '../axiosInstance';

const ExpensesList = () => {
    const [expenses, setExpenses] = useState([]);
   
    const [searchQuery, setSearchQuery] = useState("");
    const [activeSearchQuery, setActiveSearchQuery] = useState("all");
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await axiosInstance.get('/expenses/search', {
                    params: {
                        category: activeSearchQuery
                    }
                });
                setError(null);
                setExpenses(response.data.expenses);
            } catch (error) {
                setError(error.response.data.errors);
                console.error("Error fetching expenses:", error);
            }
        };

        fetchExpenses();
    }, [activeSearchQuery]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchClick = (e) => {
        setActiveSearchQuery(searchQuery);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleSearchClick();
    };

    return (
        <div className="container">
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleFormSubmit}>
                <Row className="mb-3">
                    <Col md={8}>
                        <Form.Control 
                            type="text"
                            placeholder="Search by category"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </Col>
                    <Col md={4}>
                        <Button onClick={handleSearchClick} variant="primary">
                            Search
                        </Button>
                    </Col>
                </Row>
            </Form>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Amount</th>
                        <th>Category</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((expense) => (
                        <tr key={expense.id}>
                            <td>{expense.name}</td>
                            <td>{expense.amount}</td>
                            <td>{expense.category}</td>
                            <td>{new Date(expense.date).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default ExpensesList;
