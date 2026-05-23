import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Card from '../ui/Card';

const StatusChart = ({ data }) => {
  const chartData = [
    { name: 'Todo', value: data?.todo || 0, color: '#9CA3AF' },
    { name: 'In Progress', value: data?.in_progress || 0, color: '#3B82F6' },
    { name: 'Review', value: data?.review || 0, color: '#F59E0B' },
    { name: 'Done', value: data?.done || 0, color: '#10B981' }
  ].filter(item => item.value > 0);

  if (chartData.length === 0) {
    return (
      <Card className="h-80 flex items-center justify-center">
        <p className="text-gray-500">No task data available</p>
      </Card>
    );
  }

  return (
    <Card className="h-80">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Task Status</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default StatusChart;
