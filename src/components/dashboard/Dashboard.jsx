import React from 'react';
import {
  FileText, Users, Plus, Settings
} from 'lucide-react';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

const chartData = [
  { name: 'Jan', documents: 120, users: 45 },
  { name: 'Feb', documents: 190, users: 52 },
  { name: 'Mar', documents: 150, users: 48 },
  { name: 'Apr', documents: 220, users: 61 },
  { name: 'May', documents: 180, users: 55 },
  { name: 'Jun', documents: 250, users: 68 }
];

const pieData = [
  { name: 'PDF', value: 45, color: '#06b6d4' },
  { name: 'DOC', value: 30, color: '#0891b2' },
  { name: 'XLS', value: 15, color: '#0e7490' },
  { name: 'PPT', value: 10, color: '#155e75' }
];

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Documents" value="1,234" Icon={FileText} color="cyan" />
        <Card title="Utilisateurs" value="567" Icon={Users} color="green" />
        <Card title="Documents ce mois" value="89" Icon={Plus} color="blue" />
        <Card title="Taux d'activité" value="92%" Icon={Settings} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Évolution Documents & Utilisateurs</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="documents" stroke="#06b6d4" strokeWidth={2} />
              <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Types de Documents</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, value, Icon, color }) => {
  const bg = {
    cyan: 'bg-cyan-100 text-cyan-600',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600'
  }[color];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 ${bg} rounded-lg flex items-center justify-center`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
