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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [userForm, setUserForm] = useState({
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
        console.log('Fetching users from:', `${API_BASE_URL}/api/users`);
        const res = await fetch(`${API_BASE_URL}/api/users`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'include' // Include cookies for authentication
        });
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
        }
        
        const usersData = await res.json();
        console.log('Users API Response:', usersData);

        // The backend returns an array of users directly
        if (!Array.isArray(usersData)) {
          throw new Error('Invalid users data format received from server');
        }

        const mapped = usersData.map(user => ({
          id: user._id || user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          location: user.location || '',
          color: user.color || "#3B82F6",
          isActive: user.isActive !== undefined ? user.isActive : true
        }));

        console.log('Mapped users:', mapped);
        setUsers(mapped);
      } catch (err) {
        console.error("Error loading users:", err);
        setApiError(`Failed to load users: ${err.message}`);
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

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      password: '',
      confirmPassword: '',
      role: user.role,
      location: user.location || '',
      color: user.color || "#3B82F6",
    });
    setShowAddUserModal(true);
  };

  const handleCreateUser = async () => {
    setApiError(null);
    const validationErrors = {};

    if (!userForm.name.trim()) validationErrors.name = "Name is required";
    if (!userForm.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userForm.email)) {
      validationErrors.email = "Email is invalid";
    }
    
    // Only validate password if creating a new user or changing password
    if (!editingUser) {
      if (!userForm.password) {
        validationErrors.password = "Password is required";
      } else if (userForm.password.length < 6) {
        validationErrors.password = "Password must be at least 6 characters";
      }
      if (userForm.password !== userForm.confirmPassword) {
        validationErrors.confirmPassword = "Passwords do not match";
      }
    } else if (userForm.password && userForm.password.length > 0) {
      // If editing and password is provided, validate it
      if (userForm.password.length < 6) {
        validationErrors.password = "Password must be at least 6 characters";
      }
      if (userForm.password !== userForm.confirmPassword) {
        validationErrors.confirmPassword = "Passwords do not match";
      }
    }
    
    if (!userForm.role) {
      validationErrors.role = "Role is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setCreatingUser(true);

      console.log('Sending user creation request:', {
        url: editingUser ? `${API_BASE_URL}/api/users/${editingUser.id}` : `${API_BASE_URL}/api/users`,
        method: editingUser ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: {
          name: userForm.name,
          email: userForm.email,
          password: userForm.password ? '***' : '',
          role: userForm.role,
          location: userForm.location,
          color: userForm.color,
        },
      });

      const isEditing = !!editingUser;
      const url = isEditing 
        ? `${API_BASE_URL}/api/users/${editingUser.id}`
        : `${API_BASE_URL}/api/users`;
        
      const userData = {
        name: userForm.name,
        email: userForm.email,
        role: userForm.role,
        location: userForm.location,
        color: userForm.color,
      };
      
      // Only include password if it's being changed
      if (userForm.password) {
        userData.password = userForm.password;
      }

      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      console.log('User creation response:', { status: res.status, data });

      if (!res.ok) {
        // Handle validation errors
        if (res.status === 400 && data.errors) {
          const fieldErrors = {};
          Object.entries(data.errors).forEach(([field, message]) => {
            fieldErrors[field] = message;
          });
          setErrors(fieldErrors);
          setApiError('Please correct the errors below');
        } else if (res.status === 400 && data.missingFields) {
          const fieldErrors = {};
          data.missingFields.forEach(field => {
            fieldErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
          });
          setErrors(fieldErrors);
          setApiError(data.message || 'Please fill in all required fields');
        } else {
          setApiError(data.message || `Failed to create user (${res.status})`);
        }
        return;
      }

      const userResponse = data.data || data; // Handle both formats
      
      if (editingUser) {
        // Update existing user in the list
        setUsers(prev => prev.map(u => 
          u.id === editingUser.id ? {
            ...u,
            name: userResponse.name,
            email: userResponse.email,
            role: userResponse.role,
            location: userResponse.location || '',
            color: userResponse.color || "#3B82F6",
          } : u
        ));
      } else {
        // Add new user to the list
        setUsers(prev => [
          ...prev,
          {
            id: userResponse._id || userResponse.id,
            name: userResponse.name,
            email: userResponse.email,
            role: userResponse.role,
            location: userResponse.location || '',
            color: userResponse.color || "#3B82F6",
          },
        ]);
      }

      setShowAddUserModal(false);
      setEditingUser(null);
      setUserForm({
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
                          <button 
                            onClick={() => handleEditUser(user)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4 inline-block" />
                          </button>
                          <button 
                            onClick={() => {
                              setUserToDelete(user);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Delete User"
                          >
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
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddUserModal(false);
                    setApiError(null);
                    setErrors({});
                    setEditingUser(null);
                    setUserForm({
                      name: "",
                      email: "",
                      password: "",
                      confirmPassword: "",
                      role: USER_ROLES.SUPER_ADMIN,
                      location: "",
                      color: "#3B82F6",
                    });
                  }}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
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
                      value={userForm.name}
                      onChange={e =>
                        setUserForm({ ...userForm, name: e.target.value })
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
                      value={userForm.email}
                      onChange={e =>
                        setUserForm({ ...userForm, email: e.target.value })
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
                      value={userForm.password}
                      onChange={e =>
                        setUserForm({ ...userForm, password: e.target.value })
                      }
                      placeholder={editingUser ? 'Leave blank to keep current password' : 'Enter new password'}
                      className={`w-full px-3 py-2 border ${
                        errors.password
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
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
                      value={userForm.confirmPassword}
                      onChange={e =>
                        setUserForm({
                          ...userForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder={editingUser ? 'Leave blank to keep current password' : 'Confirm new password'}
                      className={`w-full px-3 py-2 border ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
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
                      value={userForm.role}
                      onChange={e =>
                        setUserForm({ ...userForm, role: e.target.value })
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
                      value={userForm.location}
                      onChange={(e) =>
                        setUserForm({
                          ...userForm,
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
                        value={userForm.color}
                        onChange={(e) =>
                          setUserForm({ ...userForm, color: e.target.value })
                        }
                        className="h-10 w-20 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                      />
                      <input
                        type="text"
                        value={userForm.color}
                        onChange={(e) =>
                          setUserForm({ ...userForm, color: e.target.value })
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
                      setEditingUser(null);
                      setUserForm({
                        name: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                        role: USER_ROLES.SUPER_ADMIN,
                        location: "",
                        color: "#3B82F6",
                      });
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
                    {creatingUser 
                      ? (editingUser ? 'Updating...' : 'Creating...') 
                      : (editingUser ? 'Update User' : 'Create User')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && userToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Confirm Deletion
                  </h2>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setUserToDelete(null);
                    }}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Are you sure you want to delete user <strong>{userToDelete.name}</strong>? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setUserToDelete(null);
                    }}
                    disabled={isDeleting}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        setIsDeleting(true);
                        console.log('Deleting user:', userToDelete.id);
                        
                        const res = await fetch(`${API_BASE_URL}/api/users/${userToDelete.id}`, {
                          method: 'DELETE',
                          headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                          },
                          credentials: 'include', // Include cookies for authentication
                        });

                        const data = await res.json();
                        console.log('Delete response:', { status: res.status, data });

                        if (!res.ok) {
                          throw new Error(data.message || `Failed to delete user (${res.status})`);
                        }

                        // Remove the user from the local state
                        setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
                        setShowDeleteModal(false);
                        setUserToDelete(null);
                      } catch (err) {
                        console.error('Delete user error:', err);
                        setApiError(err.message || 'Failed to delete user');
                      } finally {
                        setIsDeleting(false);
                      }
                    }}
                    disabled={isDeleting}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete User'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
}