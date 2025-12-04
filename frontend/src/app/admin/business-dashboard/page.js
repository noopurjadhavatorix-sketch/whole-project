"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Target, Building, Users, Calendar, Briefcase, Search, Filter, Download, ArrowUpRight, ArrowDownRight, Globe, BarChart3, PieChart, Plus } from "lucide-react";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import BusinessLeadsTable from "@/components/admin/BusinessLeadsTable";

export default function BusinessDashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for demonstration
  const businessStats = {
    totalRevenue: "$2.4M",
    monthlyGrowth: "+18.5%",
    activeClients: 124,
    newClients: 15,
    conversionRate: "24.5%",
    avgDealSize: "$45K"
  };

  const revenueData = [
    { month: "Jan", revenue: "$180K", growth: "+12%" },
    { month: "Feb", revenue: "$195K", growth: "+8%" },
    { month: "Dec", revenue: "$220K", growth: "+13%" }
  ];

  const topPerformers = [
    {
      name: "TechCorp Solutions",
      revenue: "$450K",
      status: "active",
      growth: "+25%"
    },
    {
      name: "Global Finance Inc",
      revenue: "$380K",
      status: "active",
      growth: "+18%"
    },
    {
      name: "Healthcare Plus",
      revenue: "$320K",
      status: "pending",
      growth: "+15%"
    }
  ];

  const upcomingDeals = [
    {
      company: "Retail Dynamics",
      value: "$120K",
      closingDate: "2024-01-25",
      probability: "85%"
    },
    {
      company: "Innovation Labs",
      value: "$85K",
      closingDate: "2024-01-28",
      probability: "70%"
    }
  ];

  return (
    <ProtectedRoute>
      <AdminLayout 
        title="Business Dashboard" 
        description="Track revenue, clients, deals, and business performance metrics."
      >
        {/* Business Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8" />
              <span className="text-2xl font-bold">{businessStats.totalRevenue}</span>
            </div>
            <p className="text-emerald-100">Total Revenue</p>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-xs">{businessStats.monthlyGrowth}</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Building className="w-8 h-8" />
              <span className="text-2xl font-bold">{businessStats.activeClients}</span>
            </div>
            <p className="text-blue-100">Active Clients</p>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-xs">+{businessStats.newClients} this month</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8" />
              <span className="text-2xl font-bold">{businessStats.conversionRate}</span>
            </div>
            <p className="text-purple-100">Conversion Rate</p>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-xs">+3.2% improvement</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Briefcase className="w-8 h-8" />
              <span className="text-2xl font-bold">{businessStats.avgDealSize}</span>
            </div>
            <p className="text-orange-100">Average Deal Size</p>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-xs">+12% growth</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="flex items-center gap-2 justify-center">
              <Building className="w-4 h-4" />
              Add New Client
            </Button>
            <Button variant="outline" className="flex items-center gap-2 justify-center">
              <Briefcase className="w-4 h-4" />
              Create Deal
            </Button>
            <Button variant="outline" className="flex items-center gap-2 justify-center">
              <BarChart3 className="w-4 h-4" />
              Generate Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Revenue Trend
              </h3>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {revenueData.map((data, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-semibold">
                      {data.month.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{data.month}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Monthly Revenue</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{data.revenue}</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      {data.growth}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Clients */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                Top Performers
              </h3>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {topPerformers.map((client, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{client.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          client.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {client.status}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{client.revenue}</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      {client.growth}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Business Leads Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Business Leads</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Add Lead</span>
              </Button>
            </div>
          </div>
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <BusinessLeadsTable />
          </div>
        </div>

        {/* Upcoming Deals */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Upcoming Deals
            </h3>
            <Button variant="ghost" size="sm">
              View Pipeline
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingDeals.map((deal, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-semibold">
                    {deal.company.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{deal.company}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Closing {deal.closingDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{deal.value}</p>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{deal.probability} probability</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Business Metrics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Market Reach</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">15 Countries</p>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              +3 new markets this quarter
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <PieChart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Market Share</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">12.5%</p>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              +2.3% increase YoY
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Team Size</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">156</p>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              +12 new hires this month
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
