import React from 'react';
import { Plus, Edit, Trash2, User } from 'lucide-react';

const users = [
  { id: 1, name: 'Ahmed Bennani', email: 'ahmed@itroad.ma', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Fatima Zahra', email: 'fatima@itroad.ma', role: 'User', status: 'Active' },
  { id: 3, name: 'Mohamed Alami', email: 'mohamed@itroad.ma', role: 'User', status: 'Inactive' },
  { id: 4, name: 'Aicha Khadija', email: 'aicha@itroad.ma', role: 'Editor', status: 'Active' }
];

const UsersTabs = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Utilisateurs</h2>
        <button className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 flex items-center space-x-2">
          <Plus size={16} />
          <span>Nouvel Utilisateur</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Nom', 'Email', 'Rôle', 'Statut', 'Actions'].map((header) => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <User size={16} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                <td className="px-6 py-4">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button className="text-cyan-600 hover:text-cyan-900 mr-3">
                    <Edit size={16} />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTabs;
