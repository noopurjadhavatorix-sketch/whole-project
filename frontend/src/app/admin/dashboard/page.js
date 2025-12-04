"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Trash2,
  Download,
  Search,
  CheckSquare,
  RefreshCw,
  AlertCircle,
  X,
  Filter,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Users,
  TrendingUp,
  Calendar,
  Activity,
  Settings,
  FileText,
  Shield,
  Eye,
  Home,
  UserCheck,
  History,
  Lock,
  Briefcase,
  Building,
  Database,
} from "lucide-react";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  fetchFormSubmissions,
  deleteFormSubmission,
  deleteBulkFormSubmissions,
  exportToExcel,
} from "@/lib/api";
import { logout } from "@/lib/auth";

export default function Dashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmissions, setSelectedSubmissions] = useState([]);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterType, setFilterType] = useState("all");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ type: "", message: "" });
  const router = useRouter();

  // Fetch form submissions
  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFormSubmissions();

      if (result.success) {
        setSubmissions(result.data);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Failed to fetch submissions. Please try again.");
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on initial render
  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Handle logout
  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle select/deselect all submissions
  const handleSelectAll = () => {
    if (selectedSubmissions.length === filteredSubmissions.length) {
      // Deselect all
      setSelectedSubmissions([]);
    } else {
      // Select all
      setSelectedSubmissions(
        filteredSubmissions.map((sub) => sub._id || sub.id)
      );
    }
  };

  // Handle select/deselect single submission
  const handleSelectSubmission = (id) => {
    if (selectedSubmissions.includes(id)) {
      // Deselect
      setSelectedSubmissions((prev) => prev.filter((subId) => subId !== id));
    } else {
      // Select
      setSelectedSubmissions((prev) => [...prev, id]);
    }
  };

  // Handle delete single submission
  const handleDeleteSubmission = async (id) => {
    if (!window.confirm("Are you sure you want to delete this submission?")) {
      return;
    }

    try {
      const result = await deleteFormSubmission(id);

      if (result.success) {
        // Remove from state
        setSubmissions((prev) =>
          prev.filter((sub) => (sub._id || sub.id) !== id)
        );

        // Remove from selected
        setSelectedSubmissions((prev) => prev.filter((subId) => subId !== id));

        // Show success message
        showAlertMessage("success", "Submission deleted successfully");
      } else {
        showAlertMessage(
          "error",
          result.error || "Failed to delete submission"
        );
      }
    } catch (error) {
      showAlertMessage("error", "An error occurred. Please try again.");
      console.error("Delete error:", error);
    }
  };

  // Handle delete bulk submissions
  const handleDeleteBulk = async () => {
    if (selectedSubmissions.length === 0) {
      showAlertMessage("error", "No submissions selected");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedSubmissions.length} submissions?`
      )
    ) {
      return;
    }

    try {
      const result = await deleteBulkFormSubmissions(selectedSubmissions);

      if (result.success) {
        // Remove from state
        setSubmissions((prev) =>
          prev.filter((sub) => !selectedSubmissions.includes(sub._id || sub.id))
        );

        // Clear selected
        setSelectedSubmissions([]);

        // Show success message
        showAlertMessage("success", result.message);
      } else {
        showAlertMessage(
          "error",
          result.error || "Failed to delete submissions"
        );
      }
    } catch (error) {
      showAlertMessage("error", "An error occurred. Please try again.");
      console.error("Bulk delete error:", error);
    }
  };

  // Handle export to Excel
  const handleExport = () => {
    try {
      // Get submissions to export (either selected or all filtered)
      const dataToExport =
        selectedSubmissions.length > 0
          ? submissions.filter((sub) =>
              selectedSubmissions.includes(sub._id || sub.id)
            )
          : filteredSubmissions;

      if (dataToExport.length === 0) {
        showAlertMessage("error", "No data to export");
        return;
      }

      // Create Excel file
      const excelBlob = exportToExcel(dataToExport);

      // Create download link
      const url = window.URL.createObjectURL(excelBlob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `atorix_submissions_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);

      // Trigger download
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showAlertMessage(
        "success",
        `Exported ${dataToExport.length} submissions successfully`
      );
    } catch (error) {
      showAlertMessage("error", "Failed to export data");
      console.error("Export error:", error);
    }
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      // New field
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Show alert message
  const showAlertMessage = (type, message) => {
    setAlertMessage({ type, message });
    setShowAlert(true);

    // Auto hide after 5 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  // Filter submissions
  const filteredSubmissions = submissions
    .filter((sub) => {
      // First apply form type filter
      if (filterType !== "all") {
        if (!sub.formType) return false;
        return sub.formType === filterType;
      }
      return true;
    })
    .filter((sub) => {
      // Then apply search term
      if (!searchTerm) return true;

      const searchTermLower = searchTerm.toLowerCase();

      // Search in multiple fields
      return (
        (sub.name && sub.name.toLowerCase().includes(searchTermLower)) ||
        (sub.email && sub.email.toLowerCase().includes(searchTermLower)) ||
        (sub.company && sub.company.toLowerCase().includes(searchTermLower)) ||
        (sub.phone && sub.phone.toLowerCase().includes(searchTermLower))
      );
    })
    .sort((a, b) => {
      // Sort based on field and direction
      let valueA = a[sortField];
      let valueB = b[sortField];

      // Handle dates
      if (sortField === "createdAt") {
        valueA = new Date(valueA || 0).getTime();
        valueB = new Date(valueB || 0).getTime();
      }

      // Handle strings
      if (typeof valueA === "string" && typeof valueB === "string") {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      // Handle undefined/null
      if (valueA === undefined || valueA === null) valueA = "";
      if (valueB === undefined || valueB === null) valueB = "";

      // Compare based on direction
      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return "Invalid Date";
    }
  };

  // Calculate statistics
  const calculateStats = () => {
    const totalLeads = submissions.length;
    const lastWeek = submissions.filter(sub => {
      const subDate = new Date(sub.createdAt || sub.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return subDate >= weekAgo;
    }).length;
    const lastMonth = submissions.filter(sub => {
      const subDate = new Date(sub.createdAt || sub.date);
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      return subDate >= monthAgo;
    }).length;
    const newLeads = submissions.filter(sub => {
      const subDate = new Date(sub.createdAt || sub.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return subDate >= thirtyDaysAgo;
    }).length;
    const unspecifiedLeads = totalLeads - newLeads;
    
    return {
      totalLeads,
      lastWeek,
      lastMonth,
      onlineAdmins: 10, // Static value as shown in image
      newLeads,
      unspecifiedLeads
    };
  };

  const stats = calculateStats();

  return (
    <ProtectedRoute>
      <AdminLayout 
        title="Dashboard" 
        description="Welcome to the SuperAdmin panel. Here's an overview of your system."
      >
        {/* Alert Message */}
        {showAlert && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-start justify-between ${
              alertMessage.type === "success"
                ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"
            }`}
          >
            <div className="flex items-start">
              {alertMessage.type === "success" ? (
                <CheckSquare className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              )}
              <p>{alertMessage.message}</p>
            </div>
            <button
              onClick={() => setShowAlert(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Lead Statistics */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Overview</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Last 30 days</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            
            <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-200/50 dark:border-emerald-700/50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/20 dark:bg-emerald-700/20 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300"></div>
              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-emerald-500/10 dark:bg-emerald-400/10 p-3 rounded-xl backdrop-blur-sm">
                    <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-900/50 px-2 py-1 rounded-full">
                    +8.2%
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1">7 DAYS</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.lastWeek}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Last Week</p>
                </div>
              </div>
            </div>
            
            <div className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-200/50 dark:border-purple-700/50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/20 dark:bg-purple-700/20 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300"></div>
              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-purple-500/10 dark:bg-purple-400/10 p-3 rounded-xl backdrop-blur-sm">
                    <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-100/50 dark:bg-purple-900/50 px-2 py-1 rounded-full">
                    +15.3%
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">30 DAYS</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.lastMonth}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Last Month</p>
                </div>
              </div>
            </div>
            
            <div className="group relative overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-200/50 dark:border-amber-700/50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 dark:bg-amber-700/20 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300"></div>
              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-amber-500/10 dark:bg-amber-400/10 p-3 rounded-xl backdrop-blur-sm">
                    <UserCheck className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-100/50 dark:bg-amber-900/50 px-2 py-1 rounded-full">
                    Online
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-1">NOW</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.onlineAdmins}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Active Admins</p>
                </div>
              </div>
            </div>
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
            
            <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300"></div>
              <div className="relative p-6 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    <Building className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs font-medium">+8%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-100 mb-1">BUSINESS LEADS</p>
                  <p className="text-3xl font-bold">{stats.unspecifiedLeads}</p>
                  <p className="text-xs text-emerald-100 mt-1">Client inquiries</p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-100">This week</span>
                    <span className="font-medium">+{Math.floor(stats.unspecifiedLeads * 0.08)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300"></div>
              <div className="relative p-6 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs font-medium">+10%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-100 mb-1">TOTAL ACTIVE</p>
                  <p className="text-3xl font-bold">{stats.newLeads + stats.unspecifiedLeads}</p>
                  <p className="text-xs text-purple-100 mt-1">All leads combined</p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-purple-100">Conversion</span>
                    <span className="font-medium">3.2%</span>
                  </div>
                </div>
              </div>
            </div>
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Admin Users Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Admin Users</h3>
                      <p className="text-sm text-purple-100">System administrators</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">3</p>
                    <p className="text-xs text-purple-100">Active now</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-purple-600 dark:text-purple-400">A</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Admin User</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Super Admin</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">Online</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">M</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Manager</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Admin</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">Online</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">V</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Viewer</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Read-only</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">Away</span>
                    </div>
                  </div>
                </div>
                
                <button className="w-full mt-4 flex items-center justify-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">Manage All Users</span>
                </button>
              </div>
            </div>

            {/* System Status Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">System Status</h3>
                      <p className="text-sm text-emerald-100">All systems operational</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-xs text-emerald-100">Live</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                        <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Database</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">MongoDB Cluster</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">Healthy</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">API Server</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Node.js Runtime</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">Running</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                        <History className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Last Backup</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Automated daily</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">2h ago</span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">System uptime</span>
                    <span className="font-medium text-gray-900 dark:text-white">99.9%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
