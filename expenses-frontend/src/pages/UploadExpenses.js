import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';

import Sidebar from '../components/Sidebar';
import axiosInstance from '../axiosInstance';

const UploadExpenses = () => {
    const [expense, setExpense] = useState({
        name: '',
        description: '',
        amount: '',
        category: '',
        date: ''
    });

    const [csvFile, setCsvFile] = useState(null);
    const [statusMessage, setStatusMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExpense({ ...expense, [name]: value });
    };

    const handleManualSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/expenses', expense);
            console.log('Manual expense added:', response.data);
            setStatusMessage("Expense successfuly added")
            setExpense({
                name: '',
                description: '',
                amount: '',
                category: '',
                date: ''
            });
        } catch (error) {
            setError('Error adding expense.');
            console.error('Error adding expense:', error);
        }
    };

    const handleCsvChange = (e) => {
        setCsvFile(e.target.files[0]);
    };

    const handleCsvSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', csvFile);

        try {
            const response = await axiosInstance.post('/expenses/upload', formData, {
                headers: {
                    'Content-Type': 'text/csv',
                },
            });
            console.log('CSV expenses added:', response.data);
            setCsvFile(null);
            setStatusMessage(response.data.message)
        } catch (error) {
            console.error('Error uploading CSV:', error);
        }
    };

    return (
        <div className="d-flex">
            <Sidebar />
            <Container>
                <h1>Create Expenses</h1>
                <br />
                {error && <Alert variant="danger">{error}</Alert>}
                {statusMessage && <Alert variant="info">{statusMessage}</Alert>}
                <Row>
                    <Col md={6}>
                        <h2>Manual Entry</h2>
                        <Form onSubmit={handleManualSubmit}>
                            <Form.Group controlId="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter the expense name" 
                                    name="name" 
                                    value={expense.name} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </Form.Group>

                            <Form.Group controlId="description">
                                <Form.Label>Description</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter Description" 
                                    name="description" 
                                    value={expense.description} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </Form.Group>

                            <Form.Group controlId="amount">
                                <Form.Label>Amount</Form.Label>
                                <Form.Control 
                                    type="number" 
                                    placeholder="Enter Amount" 
                                    name="amount" 
                                    value={expense.amount} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </Form.Group>

                            <Form.Group controlId="category">
                                <Form.Label>Category</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter Category" 
                                    name="category" 
                                    value={expense.category} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </Form.Group>

                            <Form.Group controlId="date">
                                <Form.Label>Date</Form.Label>
                                <Form.Control 
                                    type="date" 
                                    name="date" 
                                    value={expense.date} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Add Expense
                            </Button>
                        </Form>
                    </Col>

                    <Col md={6}>
                        <h2>Upload CSV</h2>
                        <Form onSubmit={handleCsvSubmit}>
                            <Form.Group controlId="csvFile">
                                <Form.Label>CSV File</Form.Label>
                                <Form.Control 
                                    type="file" 
                                    accept=".csv" 
                                    onChange={handleCsvChange} 
                                    required 
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Upload CSV
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default UploadExpenses;