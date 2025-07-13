import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FileText,
  Plus,
  TrendingUp,
  Download,
  Eye,
  Activity,
  Calendar,
  FolderOpen,
  BarChart3,
} from "lucide-react";
import {
  fetchUserDocuments,
  countDocumentsByUser,
} from "../../features/document/documentSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [animationKey, setAnimationKey] = useState(0);

  // Access state from Redux store
  const documents = useSelector((state) => state.documents.list);
  const documentCount = useSelector((state) => state.documents.count);
  const loading = useSelector((state) => state.documents.loading);

  // Fetch documents and document count when the component mounts
  useEffect(() => {
    dispatch(fetchUserDocuments());
    dispatch(countDocumentsByUser());
    setAnimationKey((prev) => prev + 1);
  }, [dispatch]);

  // Helper function to get download URL
  const getDownloadUrl = (doc) => {
    return `https://itroaddocumentsservice-production.up.railway.app${doc.url}`;
  };

  // Helper function to handle document download
  const handleDownload = (doc) => {
    const downloadUrl = getDownloadUrl(doc);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate statistics from documents
  const getDocumentStats = () => {
    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    const thisMonthDocs = documents.filter(
      (doc) => new Date(doc.createdAt) >= thisMonth
    );
    const lastMonthDocs = documents.filter((doc) => {
      const docDate = new Date(doc.createdAt);
      return docDate >= lastMonth && docDate < thisMonth;
    });

    const monthlyGrowth =
      lastMonthDocs.length > 0
        ? (
            ((thisMonthDocs.length - lastMonthDocs.length) /
              lastMonthDocs.length) *
            100
          ).toFixed(1)
        : thisMonthDocs.length > 0
        ? 100
        : 0;

    // Get document types distribution
    const typeDistribution = documents.reduce((acc, doc) => {
      acc[doc.type] = (acc[doc.type] || 0) + 1;
      return acc;
    }, {});

    return {
      thisMonthCount: thisMonthDocs.length,
      monthlyGrowth,
      typeDistribution,
      totalTypes: Object.keys(typeDistribution).length,
    };
  };

  const stats = getDocumentStats();

  // Dashboard statistic cards using real data
  const dashboardStats = [
    {
      title: "Total Documents",
      value: documentCount,
      change: `+${Math.abs(stats.monthlyGrowth)}%`,
      Icon: FileText,
      color: "cyan",
      trend: stats.monthlyGrowth >= 0 ? "up" : "down",
    },
    {
      title: "Documents This Month",
      value: 6,
      change: `+${stats.monthlyGrowth}%`,
      Icon: Calendar,
      color: "blue",
      trend: stats.monthlyGrowth >= 0 ? "up" : "down",
    },
    {
      title: "Document Types",
      value: stats.totalTypes,
      change: "+5%",
      Icon: FolderOpen,
      color: "green",
      trend: "up",
    },
    {
      title: "Monthly Growth",
      value: `$10%`,
      change: "vs last month",
      Icon: TrendingUp,
      color: "purple",
      trend: stats.monthlyGrowth >= 0 ? "up" : "down",
    },
  ];

  // Show only 6 most recent documents
  const recentDocuments = documents.slice(0, 6);

  // Get chart data for document types
  const getChartData = () => {
    const maxValue = Math.max(...Object.values(stats.typeDistribution));
    return Object.entries(stats.typeDistribution).map(([type, count]) => ({
      type,
      count,
      percentage: ((count / documents.length) * 100).toFixed(1),
      height: (count / maxValue) * 100,
    }));
  };

  // Individual card for dashboard statistics
  const StatCard = ({ title, value, change, Icon, color, trend }) => {
    const colorClasses = {
      cyan: "from-cyan-400 to-cyan-600",
      green: "from-green-400 to-green-600",
      blue: "from-blue-400 to-blue-600",
      purple: "from-purple-400 to-purple-600",
    };

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-500 transform hover:scale-105">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:rotate-12`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div
            className={`flex items-center space-x-1 text-sm font-medium ${
              trend === "up" ? "text-green-600" : "text-red-600"
            }`}
          >
            <TrendingUp
              className={`w-4 h-4 transition-transform duration-300 ${
                trend === "down" ? "rotate-180" : ""
              }`}
            />
            <span>{change}</span>
          </div>
        </div>
        <div>
          <p
            className="text-2xl font-bold text-gray-900 mb-1 counter-animation"
            key={animationKey}
          >
            {value}
          </p>
          <p className="text-sm text-gray-600">{title}</p>
        </div>
      </div>
    );
  };

  // Chart component for document types
  const DocumentTypeChart = () => {
    const chartData = getChartData();

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Document Types Distribution
          </h3>
          <BarChart3 className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {chartData.map((item, index) => (
            <div key={item.type} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  {item.type}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${item.height}%`,
                      animationDelay: `${index * 200}ms`,
                    }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-gray-900 w-8">
                  {item.count}
                </span>
                <span className="text-xs text-gray-500 w-10">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Title with Animation */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
            Document Dashboard
          </h1>

          <p className="text-gray-600">
            Comprehensive overview of your document management system
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            <span className="ml-3 text-cyan-600 font-medium">
              Loading documents...
            </span>
          </div>
        )}

        {/* Statistic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <div
              key={index}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <StatCard {...stat} />
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Documents List */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Documents
              </h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-500">Live</span>
              </div>
            </div>
            <div className="space-y-3">
              {recentDocuments.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:from-blue-50 hover:to-cyan-50 transition-all duration-300 transform hover:scale-102 animate-slide-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 hover:text-cyan-600 transition-colors">
                        {doc.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(doc.createdAt).toLocaleDateString()}{" "}

                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 rounded-full text-xs font-medium">
                      {doc.type}
                    </span>
                    <button className="p-2 hover:bg-blue-100 rounded-lg transition-all duration-200 transform hover:scale-110">
                      <Eye className="w-4 h-4 text-gray-400 hover:text-blue-500" />
                    </button>
                    <button
                      onClick={() => handleDownload(doc)}
                      className="p-2 hover:bg-green-100 rounded-lg transition-all duration-200 transform hover:scale-110"
                    >
                      <Download className="w-4 h-4 text-gray-400 hover:text-green-500" />
                    </button>
                  </div>
                </div>
              ))}
              {recentDocuments.length === 0 && !loading && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No documents found</p>
                </div>
              )}
            </div>
          </div>

          {/* Document Types Chart */}
          <div className="animate-fade-in">
            <DocumentTypeChart />
          </div>
        </div>

        {/* Activity Summary */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Activity Summary
            </h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-cyan-600 mb-2">
                {documents.length}
              </div>
              <div className="text-sm text-gray-600">Total Documents</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600 mb-2">6</div>
              <div className="text-sm text-gray-600">This Month</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {stats.totalTypes}
              </div>
              <div className="text-sm text-gray-600">Document Types</div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }

        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }

        .counter-animation {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
