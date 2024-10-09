import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineController
} from 'chart.js';

// Register the required components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement, LineController);

const ExpenseBarChart = ({ expenseResponse }) => {
  const prepareData = (expenses) => {
    const groupedData = {};
    const totalExpensesByMonth = {};

    // Group expenses by month and category
    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      const category = expense.category;

      if (!groupedData[month]) {
        groupedData[month] = {};
        totalExpensesByMonth[month] = 0;
      }

      if (!groupedData[month][category]) {
        groupedData[month][category] = 0;
      }

      groupedData[month][category] += expense.amount;
      totalExpensesByMonth[month] += expense.amount;
    });

    return { groupedData, totalExpensesByMonth };
  };

  const formatChartData = (groupedData, totalExpensesByMonth) => {
    const months = Object.keys(groupedData);

    const barDatasets = [];
    
    // Define a set of teal shades for bars
    const tealShades = [
      'rgba(0, 128, 128, 0.8)',  // dark teal
      'rgba(32, 178, 170, 0.8)', // medium teal
      'rgba(64, 224, 208, 0.8)', // light teal
      'rgba(175, 238, 238, 0.8)' // very light teal
    ];

    months.forEach((month) => {
      const monthData = groupedData[month];
      const categories = Object.keys(monthData);

      categories.forEach((category, index) => {
        // Find if a dataset for the category exists already, if not, create one
        let dataset = barDatasets.find(ds => ds.label === category);
        if (!dataset) {
          dataset = {
            label: category,
            data: Array(months.length).fill(0), // Initially fill data array with 0s for all months
            backgroundColor: tealShades[index % tealShades.length], // Assign a shade of teal
          };
          barDatasets.push(dataset);
        }

        // Find the index of the current month in the labels array and set the correct value
        const monthIndex = months.indexOf(month);
        dataset.data[monthIndex] = monthData[category];
      });
    });

    const lineDataset = {
      label: 'Total Expense',
      data: months.map(month => totalExpensesByMonth[month]),
      type: 'line',
      fill: false,
      borderColor: 'rgba(255, 0, 0, 1)', // Red line color
      borderWidth: 2,
      tension: 0.1,
      pointBackgroundColor: 'rgba(255, 0, 0, 1)',
    };

    return { months, datasets: [...barDatasets, lineDataset] };
  };

  if (!expenseResponse.success) {
    return <div>Error loading expenses.</div>;
  }

  const { groupedData, totalExpensesByMonth } = prepareData(expenseResponse.expenses);
  const { months, datasets } = formatChartData(groupedData, totalExpensesByMonth);

  const data = {
    labels: months,
    datasets,
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px'}}>
      <div style={{ width: '100%', maxWidth: '800px' }}>
        <h3 style={{ textAlign: 'center' }}>Expenses overview</h3>
        <Bar
          data={data}
          options={{
            responsive: true,
            scales: {
              x: {
                stacked: false, // Grouped bars
                title: {
                  display: true,
                  text: 'Months',
                },
                type: 'category',
              },
              y: {
                stacked: false, // Grouped bars
                title: {
                  display: true,
                  text: 'Expenses',
                },
              },
            },
            plugins: {
              legend: {
                position: 'bottom',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default ExpenseBarChart;
