"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import AdminLayout from "@/components/admin/AdminLayout";
import RoleBasedRoute from "@/components/admin/RoleBasedRoute";
import { 
  Users, BarChart3, TrendingUp, Calendar, 
  AlertCircle, X, CheckSquare, Database, Activity, History,
  FileText, Briefcase, Building, Settings, Shield
} from "lucide-react";

function AdminDashboardContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmissions, setSelectedSubmissions] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ type: "", message: "" });
  const [stats, setStats] = useState({
    totalLeads: 0,
    lastWeek: 0,
    lastMonth: 0,
    onlineAdmins: 0,
    newLeads: 0,
    unspecifiedLeads: 0
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin/login");
    }
    
    // Simulate loading stats
    const loadStats = () => {
      setStats({
        totalLeads: 156,
        lastWeek: 42,
        lastMonth: 128,
        onlineAdmins: 5,
        newLeads: 24,
        unspecifiedLeads: 132
      });
    };
    
    loadStats();
  }, [router]);

  const showAlertMessage = (type, message) => {
    setAlertMessage({ type, message });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Alert Message */}
      {showAlert && (
        <div className={`mb-6 p-4 rounded-lg flex items-start justify-between ${
          alertMessage.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-start">
            {alertMessage.type === 'success' ? (
              <CheckSquare className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {alertMessage.type === 'success' ? 'Success' : 'Error'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {alertMessage.message}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAlert(false)}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-2">Total Users</h3>
          <p className="text-3xl font-bold">156</p>
          <p className="text-sm text-gray-500">Active users</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-2">System Health</h3>
          <p className="text-3xl font-bold text-green-500">100%</p>
          <p className="text-sm text-gray-500">All systems operational</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-2">Active Sessions</h3>
          <p className="text-3xl font-bold">24</p>
          <p className="text-sm text-gray-500">Current users</p>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="mt-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Overview</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>Last 30 days</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stats Cards with Icons */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-200/50 dark:border-blue-700/50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 dark:bg-blue-700/20 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300"></div>
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-blue-500/10 dark:bg-blue-400/10 p-3 rounded-xl backdrop-blur-sm">
                  <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100/50 dark:bg-blue-900/50 px-2 py-1 rounded-full">
                  +12.5%
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">ALL TIME</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalLeads}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total Leads</p>
              </div>
            </div>
          </div>
          
          {/* More stats cards... */}
        </div>
      </div>

      {/* Lead Management Overview */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Lead Management Overview</h2>
          <button className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
            <FileText className="w-4 h-4" />
            <span>View All Leads</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300"></div>
            <div className="relative p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-medium">+12%</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-100 mb-1">HIRING APPLICATIONS</p>
                <p className="text-3xl font-bold">{stats.newLeads}</p>
                <p className="text-xs text-blue-100 mt-1">Active candidates</p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-100">This week</span>
                  <span className="font-medium">+{Math.floor(stats.newLeads * 0.1)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* More lead management cards... */}
        </div>
      </div>

      {/* Admin Users Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">System Administration</h2>
          <button className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
            <Settings className="w-4 h-4" />
            <span>Manage Settings</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Admin Activity</h3>
              {/* Admin activity content */}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">System Status</h3>
              <div className="space-y-4">
                {/* System status items */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <RoleBasedRoute allowedRoles={['super_admin']}>
      <AdminLayout>
        <AdminDashboardContent />
      </AdminLayout>
    </RoleBasedRoute>
  );
}