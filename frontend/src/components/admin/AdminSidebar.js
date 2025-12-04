"use client";

"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import {
  BarChart3,
  Users,
  FileText,
  TrendingUp,
  Activity,
  History,
  Shield,
  Settings,
  Home,
  LogOut,
  Briefcase,
  Building,
  ChevronDown,
  ChevronRight,
  UserCheck,
  DollarSign,
  Bell,
} from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState([]);
  const [newDemoRequests, setNewDemoRequests] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: BarChart3,
    },
    {
      name: "HR Dashboard",
      href: "/admin/hr-dashboard",
      icon: UserCheck,
    },
    {
      name: "Business Dashboard",
      href: "/admin/business-dashboard",
      icon: DollarSign,
      badge: !loading && newDemoRequests > 0 ? newDemoRequests : null,
    },
    {
      name: "User Management",
      href: "/admin/user-management",
      icon: Users,
    },
    {
      name: "Lead Management",
      href: "/admin/lead-management",
      icon: FileText,
      subItems: [
        {
          name: "Hiring",
          href: "/admin/lead-management/hiring",
          icon: Briefcase,
        },
        {
          name: "Business",
          href: "/admin/lead-management/management",
          icon: Building,
        },
      ],
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: TrendingUp,
    },
    {
      name: "Admin Activity",
      href: "/admin/admin-activity",
      icon: Activity,
    },
    {
      name: "Audit Logs",
      href: "/admin/audit-logs",
      icon: History,
    },
    {
      name: "Role Permissions",
      href: "/admin/role-permissions",
      icon: Shield,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  // Fetch new demo requests count
  useEffect(() => {
    const fetchNewDemoRequests = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/demo-requests/count');
        const data = await response.json();
        if (data.success) {
          setNewDemoRequests(data.count);
        }
      } catch (error) {
        console.error('Error fetching demo requests count:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewDemoRequests();
    
    // Refresh count every 5 minutes
    const interval = setInterval(fetchNewDemoRequests, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Auto-expand Lead Management if user is on a subcategory page
  React.useEffect(() => {
    if (pathname.includes('/lead-management/')) {
      if (!expandedItems.includes('Lead Management')) {
        setExpandedItems(prev => [...prev, 'Lead Management']);
      }
    }
  }, [pathname, expandedItems]);

  const toggleExpanded = (itemName) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  const isExpanded = (itemName) => {
    // Always expand if it's in the expanded state
    if (expandedItems.includes(itemName)) return true;
    
    // Auto-expand Lead Management if on subcategory page
    if (itemName === 'Lead Management' && pathname.includes('/lead-management/')) {
      return true;
    }
    
    return false;
  };

  const handleLogout = () => {
    router.push("/admin/login");
  };

  return (
    <div className="w-64 bg-slate-900 dark:bg-slate-950 min-h-screen">
      <div className="p-6">
        <div className="flex items-center mb-8">
          <Image
            src="/atorix-logo.png"
            alt="Atorix IT Logo"
            width={120}
            height={40}
            priority
          />
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const isItemExpanded = isExpanded(item.name);
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const Icon = item.icon;

            return (
              <div key={item.name}>
                <a
                  href={item.href}
                  className={`flex items-center justify-between rounded-lg px-4 py-3 transition-colors ${
                    isActive
                      ? "text-white bg-purple-600"
                      : "text-gray-300 hover:text-white hover:bg-slate-800"
                  }`}
                  onClick={(e) => {
                    if (hasSubItems) {
                      e.preventDefault();
                      toggleExpanded(item.name);
                    }
                  }}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge !== null && item.badge !== undefined && item.badge > 0 && (
                      <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {hasSubItems && (
                    isItemExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )
                  )}
                </a>

                {hasSubItems && isItemExpanded && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.subItems.map((subItem) => {
                      const isSubActive = pathname === subItem.href;
                      const SubIcon = subItem.icon;

                      return (
                        <a
                          key={subItem.name}
                          href={subItem.href}
                          className={`flex items-center space-x-3 rounded-lg px-4 py-2 transition-colors ${
                            isSubActive
                              ? "text-white bg-purple-600"
                              : "text-gray-400 hover:text-white hover:bg-slate-800"
                          }`}
                        >
                          <SubIcon className="w-4 h-4" />
                          <span className="text-sm">{subItem.name}</span>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg px-4 py-3 transition-colors w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
