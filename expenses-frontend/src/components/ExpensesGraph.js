import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosInstance';

import ExpenseBarChart from './ExpenseBarChart';

const ExpensesGraph = () => {
  const [expenseResponse, setExpenseResponse] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      try {
        const response = await axiosInstance.get('/expenses');
        setExpenseResponse(response.data);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchExpenses();
  }, [isAuthenticated, navigate]);

  return (
    <div className="container text-center">
      <Row className="justify-content-center mb-4">
        <Col md={8}>
          {expenseResponse ? (
            <ExpenseBarChart expenseResponse={expenseResponse} />
          ) : (
            <p>Loading...</p>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ExpensesGraph;