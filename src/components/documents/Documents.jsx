import React from 'react';
import { FileText, Edit, Trash2, Plus } from 'lucide-react';

const documents = [
  { id: 1, name: 'Rapport Mensuel.pdf', size: '2.5 MB', type: 'PDF', date: '2024-01-15', user: 'Ahmed Bennani' },
  { id: 2, name: 'Présentation Client.pptx', size: '8.2 MB', type: 'PPT', date: '2024-01-14', user: 'Fatima Zahra' },
  { id: 3, name: 'Base de données.xlsx', size: '1.8 MB', type: 'XLS', date: '2024-01-13', user: 'Mohamed Alami' },
  { id: 4, name: 'Contrat Service.docx', size: '456 KB', type: 'DOC', date: '2024-01-12', user: 'Aicha Khadija' }
];

const Documents = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Documents</h2>
        <button className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 flex items-center space-x-2">
          <Plus size={16} />
          <span>Nouveau Document</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Nom', 'Type', 'Taille', 'Utilisateur', 'Date', 'Actions'].map(header => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-cyan-100 text-cyan-800">
                    {doc.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{doc.size}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{doc.user}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{doc.date}</td>
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

export default Documents;
