import { FileText, Users, Plus, TrendingUp, Download, Eye, Activity } from "lucide-react"

const Dashboard = () => {
  const stats = [
    { title: "Total Documents", value: "1,234", change: "+12%", Icon: FileText, color: "cyan", trend: "up" },
    { title: "Active Users", value: "567", change: "+8%", Icon: Users, color: "green", trend: "up" },
    { title: "Documents This Month", value: "89", change: "+23%", Icon: Plus, color: "blue", trend: "up" },
    { title: "Activity Rate", value: "92%", change: "-2%", Icon: TrendingUp, color: "purple", trend: "down" },
  ]

  const recentDocuments = [
    { name: "Q1 Report 2024.pdf", user: "Ahmed B.", time: "2h", type: "PDF" },
    { name: "Client Presentation.pptx", user: "Fatima Z.", time: "4h", type: "PPT" },
    { name: "Budget 2024.xlsx", user: "Mohamed A.", time: "6h", type: "XLS" },
    { name: "Service Contract.docx", user: "Aicha K.", time: "1d", type: "DOC" },
  ]

  const activities = [
    { action: "Document downloaded", user: "Ahmed Bennani", time: "5 min", type: "upload" },
    { action: "New user registered", user: "Sara Alami", time: "15 min", type: "user" },
    { action: "Document updated", user: "Mohamed Tazi", time: "30 min", type: "edit" },
    { action: "System login", user: "Admin", time: "1h", type: "login" },
  ]

  const StatCard = ({ title, value, change, Icon, color, trend }) => {
    const colorClasses = {
      cyan: "from-cyan-400 to-cyan-600",
      green: "from-green-400 to-green-600",
      blue: "from-blue-400 to-blue-600",
      purple: "from-purple-400 to-purple-600",
    }

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
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Headers */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Overview of your management system</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Documents */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Documents</h3>
              <button className="text-cyan-600 hover:text-cyan-700 font-medium text-sm">View All</button>
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
                        By {doc.user} • {doc.time}
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

          {/* Activity Feed */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.action}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard
