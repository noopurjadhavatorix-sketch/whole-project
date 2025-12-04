"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserCheck, Users, TrendingUp, Calendar, Briefcase, Award, Clock, Target, Search, Filter, Download, Mail, Phone } from "lucide-react";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";

export default function HRDashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for demonstration
  const hrStats = {
    totalEmployees: 156,
    newHires: 12,
    openPositions: 8,
    avgRetention: "92%",
    trainingSessions: 24,
    performanceReviews: 45
  };

  const recentHires = [
    {
      name: "Alex Johnson",
      position: "Senior Developer",
      department: "Engineering",
      startDate: "2024-01-15",
      status: "onboarding"
    },
    {
      name: "Maria Garcia",
      position: "UX Designer",
      department: "Design",
      startDate: "2024-01-10",
      status: "active"
    },
    {
      name: "James Wilson",
      position: "Product Manager",
      department: "Product",
      startDate: "2024-01-08",
      status: "active"
    }
  ];

  const upcomingReviews = [
    {
      name: "Sarah Chen",
      position: "Team Lead",
      department: "Engineering",
      reviewDate: "2024-01-20",
      type: "Quarterly Review"
    },
    {
      name: "Michael Brown",
      position: "Marketing Manager",
      department: "Marketing",
      reviewDate: "2024-01-22",
      type: "Annual Review"
    }
  ];

  return (
    <ProtectedRoute>
      <AdminLayout 
        title="HR Dashboard" 
        description="Manage employees, recruitment, performance, and HR operations."
      >
        {/* HR Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8" />
              <span className="text-2xl font-bold">{hrStats.totalEmployees}</span>
            </div>
            <p className="text-blue-100">Total Employees</p>
          </div>
          
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <UserCheck className="w-8 h-8" />
              <span className="text-2xl font-bold">{hrStats.newHires}</span>
            </div>
            <p className="text-emerald-100">New Hires (This Month)</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Briefcase className="w-8 h-8" />
              <span className="text-2xl font-bold">{hrStats.openPositions}</span>
            </div>
            <p className="text-purple-100">Open Positions</p>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8" />
              <span className="text-2xl font-bold">{hrStats.avgRetention}</span>
            </div>
            <p className="text-orange-100">Retention Rate</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="flex items-center gap-2 justify-center">
              <UserCheck className="w-4 h-4" />
              Add New Employee
            </Button>
            <Button variant="outline" className="flex items-center gap-2 justify-center">
              <Briefcase className="w-4 h-4" />
              Post New Position
            </Button>
            <Button variant="outline" className="flex items-center gap-2 justify-center">
              <Award className="w-4 h-4" />
              Schedule Review
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Hires */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                Recent Hires
              </h3>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {recentHires.map((hire, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {hire.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{hire.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{hire.position} • {hire.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Started {hire.startDate}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      hire.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {hire.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Reviews */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                Upcoming Reviews
              </h3>
              <Button variant="ghost" size="sm">
                Schedule
              </Button>
            </div>
            <div className="space-y-4">
              {upcomingReviews.map((review, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {review.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{review.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{review.position} • {review.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{review.reviewDate}</p>
                    <Button variant="ghost" size="sm">
                      <Calendar className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Department Overview */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            Department Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">45</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Engineering</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">28</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Marketing</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">32</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sales</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">51</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Operations</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
