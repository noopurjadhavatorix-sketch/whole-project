"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Users,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  MessageSquare,
} from "lucide-react";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

// Status badge
const StatusBadge = ({ status }) => {
  const statusConfig = {
    new: {
      label: "New",
      icon: <Clock className="w-3 h-3 mr-1" />,
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    },
    contacted: {
      label: "Contacted",
      icon: <MessageSquare className="w-3 h-3 mr-1" />,
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    },
    qualified: {
      label: "Qualified",
      icon: <CheckCircle className="w-3 h-3 mr-1" />,
      color:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
    lost: {
      label: "Lost",
      icon: <AlertCircle className="w-3 h-3 mr-1" />,
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    },
  };

  const config = statusConfig[status] || statusConfig.new;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};

// Stat card
const StatCard = ({ title, value, icon, color, loading }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 ${color} border-opacity-50`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-full ${color} bg-opacity-20`}>{icon}</div>
      </div>
    </div>
  );
};

// Single row
const LeadRow = ({ lead, onStatusChange }) => (
  <tr key={lead._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {lead.name}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {lead.phone}
          </div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900 dark:text-white">{lead.email}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900 dark:text-white">
        {lead.company || "N/A"}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {lead.role || "N/A"}
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="flex flex-wrap gap-1 max-w-xs">
        {Array.isArray(lead.interests) && lead.interests.length > 0 ? (
          lead.interests.map((interest, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {interest}
            </span>
          ))
        ) : (
          <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
        )}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <StatusBadge status={lead.status} />
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <div className="flex space-x-2">
        {/* Frontend-only status change for now */}
        <select
          value={lead.status || "new"}
          onChange={(e) => onStatusChange(lead._id, e.target.value)}
          className="text-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="lost">Lost</option>
        </select>
        <a
          href={`mailto:${lead.email}`}
          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
          title="Send Email"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </a>
      </div>
    </td>
  </tr>
);

export default function LeadManagement() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    contactedLeads: 0,
    qualifiedLeads: 0,
  });

  // Fetch from your backend demo-requests endpoint
  const fetchLeads = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch("http://localhost:5001/api/demo-requests", {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch leads");
      }

      const data = await response.json();
      // backend shape: { success, count, data: [...] }
      const leadsArray =
        data && data.success && Array.isArray(data.data) ? data.data : [];

      setLeads(leadsArray);
      setLastUpdated(new Date());

      const totalLeads = leadsArray.length;
      const newLeads = leadsArray.filter(
        (lead) => lead.status === "new" || !lead.status
      ).length;
      const contactedLeads = leadsArray.filter(
        (lead) => lead.status === "contacted"
      ).length;
      const qualifiedLeads = leadsArray.filter(
        (lead) => lead.status === "qualified"
      ).length;

      setStats({
        totalLeads,
        newLeads,
        contactedLeads,
        qualifiedLeads,
      });
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error(error.message || "Error fetching leads");
      setLeads([]);
      setStats({
        totalLeads: 0,
        newLeads: 0,
        contactedLeads: 0,
        qualifiedLeads: 0,
      });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // For now, update status only on frontend (no PATCH route in backend)
  const updateLeadStatus = (id, newStatus) => {
    if (!id) {
      toast.error("Invalid lead ID");
      return;
    }

    setLeads((prev) =>
      prev.map((lead) =>
        lead._id === id ? { ...lead, status: newStatus } : lead
      )
    );

    // Recompute stats
    setStats((prevStats) => {
      const updated = leads.map((lead) =>
        lead._id === id ? { ...lead, status: newStatus } : lead
      );
      const totalLeads = updated.length;
      const newLeads = updated.filter(
        (lead) => lead.status === "new" || !lead.status
      ).length;
      const contactedLeads = updated.filter(
        (lead) => lead.status === "contacted"
      ).length;
      const qualifiedLeads = updated.filter(
        (lead) => lead.status === "qualified"
      ).length;

      return {
        totalLeads,
        newLeads,
        contactedLeads,
        qualifiedLeads,
      };
    });

    toast.success("Lead status updated (frontend only)");
  };

  useEffect(() => {
    fetchLeads();
    const pollInterval = setInterval(fetchLeads, 60000);
    return () => clearInterval(pollInterval);
  }, [fetchLeads]);

  return (
    <ProtectedRoute>
      <AdminLayout
        title="Lead Management"
        description="Manage and track all demo requests in real-time."
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Lead Dashboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated:{" "}
              {formatDistanceToNow(lastUpdated, { addSuffix: true })}
            </p>
          </div>
          <Button
            onClick={() => fetchLeads()}
            variant="outline"
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Leads"
            value={stats.totalLeads}
            icon={<Users className="w-6 h-6 text-blue-500" />}
            color="border-blue-500"
            loading={loading}
          />
          <StatCard
            title="New Leads"
            value={stats.newLeads}
            icon={<Clock className="w-6 h-6 text-yellow-500" />}
            color="border-yellow-500"
            loading={loading}
          />
          <StatCard
            title="Contacted"
            value={stats.contactedLeads}
            icon={<MessageSquare className="w-6 h-6 text-purple-500" />}
            color="border-purple-500"
            loading={loading}
          />
          <StatCard
            title="Qualified"
            value={stats.qualifiedLeads}
            icon={<CheckCircle className="w-6 h-6 text-green-500" />}
            color="border-green-500"
            loading={loading}
          />
        </div>

        {/* Leads Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                Demo Requests
              </h2>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : leads.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text:white mb-1">
                  No demo requests found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Requests submitted through the demo form will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Interests
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {leads.map((lead) => (
                      <LeadRow
                        key={lead._id}
                        lead={lead}
                        onStatusChange={updateLeadStatus}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}