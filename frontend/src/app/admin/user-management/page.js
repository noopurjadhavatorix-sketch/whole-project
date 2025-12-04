"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, Search, Plus, Edit, Trash2, X } from "lucide-react";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";

// User role constants
const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  HR_MODE: 'hr_mode',
  BUSINESS_MODE: 'business_mode'
};

// Default validation errors object
const DEFAULT_VALIDATION_ERRORS = {};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [apiError, setApiError] = useState(null);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: USER_ROLES.SUPER_ADMIN,
    location: "",
    color: "#3B82F6",
  });

  const [errors, setErrors] = useState(DEFAULT_VALIDATION_ERRORS);

  // Fetch users from backend on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const res = await fetch(`${API_BASE_URL}/api/users`);
        const json = await res.json();

        if (!res.ok || !json.success) {
          console.error("Failed to fetch users:", json.message);
          return;
        }

        const mapped = json.data.map(u => ({
          id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          location: u.location,
          color: u.color || "#3B82F6",
        }));

        setUsers(mapped);
      } catch (err) {
        console.error("Error loading users:", err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      (user.location || "").toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term)
    );
  });

  const handleCreateUser = async () => {
    setApiError(null);
    const validationErrors = {};

    if (!newUser.name.trim()) validationErrors.name = "Name is required";
    if (!newUser.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(newUser.email)) {
      validationErrors.email = "Email is invalid";
    }
    if (!newUser.password) {
      validationErrors.password = "Password is required";
    } else if (newUser.password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters";
    }
    if (newUser.password !== newUser.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }
    if (!newUser.role) {
      validationErrors.role = "Role is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setCreatingUser(true);

      const res = await fetch(`${API_BASE_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          role: newUser.role,
          location: newUser.location,
          color: newUser.color,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setApiError(data.message || "Failed to create user");
        return;
      }

      const created = data.data;

      setUsers(prev => [
        ...prev,
        {
          id: created._id,
          name: created.name,
          email: created.email,
          role: created.role,
          location: created.location,
          color: created.color || "#3B82F6",
        },
      ]);

      setShowAddUserModal(false);
      setNewUser({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: USER_ROLES.SUPER_ADMIN,
        location: "",
        color: "#3B82F6",
      });
      setErrors({});
    } catch (err) {
      console.error("Create user error:", err);
      setApiError("Network error while creating user");
    } finally {
      setCreatingUser(false);
    }
  };

  return (
    <ProtectedRoute>
      <AdminLayout
        title="User Management"
        description="Manage system users and their permissions."
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
              <Button
                onClick={() => setShowAddUserModal(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add User
              </Button>
            </div>

            {loadingUsers ? (
              <div className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                Loading users...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No users found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Get started by adding your first user.
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
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredUsers.map(user => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className="flex-shrink-0 h-8 w-8 rounded-full"
                              style={{ backgroundColor: user.color }}
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === USER_ROLES.SUPER_ADMIN
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
                                : user.role === USER_ROLES.HR_MODE
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            }`}
                          >
                            {user.role === USER_ROLES.HR_MODE
                              ? "HR Mode"
                              : user.role === USER_ROLES.BUSINESS_MODE
                              ? "Business Mode"
                              : "Super Admin"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {user.location || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4">
                            <Edit className="w-4 h-4 inline-block" />
                          </button>
                          <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                            <Trash2 className="w-4 h-4 inline-block" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Add User Modal */}
        {showAddUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Add New User
                </h2>
                <button
                  onClick={() => {
                    setShowAddUserModal(false);
                    setApiError(null);
                    setErrors({});
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={e =>
                        setNewUser({ ...newUser, name: e.target.value })
                      }
                      className={`w-full px-3 py-2 border ${
                        errors.name
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      placeholder="Enter user name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={e =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                      className={`w-full px-3 py-2 border ${
                        errors.email
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      placeholder="Enter email address"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password *
                    </label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={e =>
                        setNewUser({ ...newUser, password: e.target.value })
                      }
                      className={`w-full px-3 py-2 border ${
                        errors.password
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      placeholder="Enter new password"
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      value={newUser.confirmPassword}
                      onChange={e =>
                        setNewUser({
                          ...newUser,
                          confirmPassword: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      placeholder="Confirm new password"
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Role *
                    </label>
                    <select
                      value={newUser.role}
                      onChange={e =>
                        setNewUser({ ...newUser, role: e.target.value })
                      }
                      className="w-full p-2 border rounded"
                    >
                      <option value={USER_ROLES.SUPER_ADMIN}>Super Admin</option>
                      <option value={USER_ROLES.HR_MODE}>HR Mode</option>
                      <option value={USER_ROLES.BUSINESS_MODE}>Business Mode</option>
                    </select>
                    {errors.role && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.role}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={newUser.location}
                      onChange={(e) =>
                        setNewUser({
                          ...newUser,
                          location: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter location"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={newUser.color}
                        onChange={(e) =>
                          setNewUser({ ...newUser, color: e.target.value })
                        }
                        className="h-10 w-20 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                      />
                      <input
                        type="text"
                        value={newUser.color}
                        onChange={(e) =>
                          setNewUser({ ...newUser, color: e.target.value })
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="#3B82F6"
                      />
                    </div>
                  </div>

                  {apiError && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {apiError}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddUserModal(false);
                      setApiError(null);
                      setErrors({});
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateUser}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={creatingUser}
                  >
                    {creatingUser ? "Creating..." : "Create User"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
}