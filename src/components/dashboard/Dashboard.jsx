import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FileText, Users, Plus, TrendingUp, Download, Eye, Activity } from "lucide-react";
import { fetchUserDocuments, countDocumentsByUser } from "../../features/document/documentSlice"; // Adjust path as needed

const Dashboard = () => {
  const dispatch = useDispatch();

  // Access state from Redux store
  const documents = useSelector(state => state.documents.list);
  const documentCount = useSelector(state => state.documents.count);
  const loading = useSelector(state => state.documents.loading);

  // Fetch documents and document count when the component mounts
  useEffect(() => {
    dispatch(fetchUserDocuments());
    dispatch(countDocumentsByUser());
  }, [dispatch]);

  // Dashboard statistic cards using real data
  const stats = [
    {
      title: "Total Documents",
      value: documentCount,
      change: "+12%",
      Icon: FileText,
      color: "cyan",
      trend: "up",
    },
    {
      title: "Active Users",
      value: "N/A", // Placeholder for future data
      change: "+8%",
      Icon: Users,
      color: "green",
      trend: "up",
    },
    {
      title: "Documents This Month",
      value: documents.length,
      change: "+23%",
      Icon: Plus,
      color: "blue",
      trend: "up",
    },
    {
      title: "Activity Rate",
      value: "N/A", // Placeholder
      change: "-2%",
      Icon: TrendingUp,
      color: "purple",
      trend: "down",
    },
  ];

  // Show only 4 most recent documents
  const recentDocuments = documents.slice(0, 4);

  // Individual card for dashboard statistics
  const StatCard = ({ title, value, change, Icon, color, trend }) => {
    const colorClasses = {
      cyan: "from-cyan-400 to-cyan-600",
      green: "from-green-400 to-green-600",
      blue: "from-blue-400 to-blue-600",
      purple: "from-purple-400 to-purple-600",
    };

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div
            className={`flex items-center space-x-1 text-sm font-medium ${
              trend === "up" ? "text-green-600" : "text-red-600"
            }`}
          >
            <TrendingUp className={`w-4 h-4 ${trend === "down" ? "rotate-180" : ""}`} />
            <span>{change}</span>
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
          <p className="text-sm text-gray-600">{title}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Overview of your document management system</p>
        </div>

        {/* Display loading or error */}
        {loading && <p className="text-sm text-blue-500">Loading...</p>}
  
        {/* Statistic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Documents List */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Documents</h3>
            </div>
            <div className="space-y-4">
              {recentDocuments.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-sm text-gray-500">
                        By User {doc.userId} • {doc.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-lg text-xs font-medium">
                      {doc.type}
                    </span>
                    <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                      <Eye className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                      <Download className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed Placeholder */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">Coming soon: Activity feed based on document history.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
