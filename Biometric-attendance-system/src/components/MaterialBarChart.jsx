import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { useSelector } from 'react-redux';

const chartSetting = {
  xAxis: [
    {
      label: 'Month',
      labelColor: '#ffffff', // Change X-axis label color to white
    },
  ],
  width: 850,
  height: 310,
  textColor: '#ffffff', // Change text color to white
  grid: {
    horizontal: true, // Display horizontal grid lines
    vertical: true, // Hide vertical grid lines
    borderColor: '#ffffff', // Grid border color (to match text color)
    borderWidth: 0, // Set border width to 0 to hide border lines
  },
};

const valueFormatter = (value) =>
  value !== null && value !== undefined ? value.toString() : '';

export default function MaterialBarChart() {
  const { students } = useSelector((state) => state.admin);

  // Aggregate data by month and exam status
  const aggregatedData = students.reduce((acc, student) => {
    const { month, examStatus } = student;

    // Ensure that the month entry exists
    if (!acc[month]) {
      acc[month] = { month, written: 0, notWritten: 0, totalStudents: 0 };
    }

    // Increment the correct status counter and total students
    if (examStatus === 'Written') {
      acc[month].written += 1;
    } else if (examStatus === 'Not written') {
      acc[month].notWritten += 1;
    }

    // Increment total students
    acc[month].totalStudents += 1;

    return acc;
  }, {});

  // Convert the aggregated data object to an array for chart input
  const chartData = Object.values(aggregatedData);

  return (
    <BarChart
      dataset={chartData}
      yAxis={[
        {
          label: 'Number of Students', // Change Y-axis label
          scaleType: 'band',
          dataKey: 'month',
          labelColor: '#ffffff', // Change Y-axis label color to white
          tick: {
            color: '#ffffff', // Hide Y-axis ticks if needed
          },
        },
      ]}
      series={[
        {
          dataKey: 'written',
          label: 'Sat', // Short label for students who sat for the exam
          valueFormatter,
          color: '#1976d2', // Color for Written bars
        },
        {
          dataKey: 'notWritten',
          label: 'Not Sat', // Short label for students who did not sit for the exam
          valueFormatter,
          color: '#d32f2f', // Color for Not Written bars
        },
        {
          dataKey: 'totalStudents',
          label: 'Total', // Short label for Total Students
          valueFormatter,
          color: '#d1d1d1', // Color for Total Students bars
        },
      ]}
      layout="horizontal"
      grid={chartSetting.grid} // Apply grid settings
      {...chartSetting}
    />
  );
}
