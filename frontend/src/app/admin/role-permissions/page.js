"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Shield, Check, X } from "lucide-react";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";

const roles = ['SuperAdmin', 'Admin', 'EditMode', 'ViewMode'];
const permissions = [
  { feature: 'Dashboard', actions: { create: false, read: true, update: false, delete: false, view: true } },
  { feature: 'Leads', actions: { create: true, read: true, update: true, delete: true, view: true } },
  { feature: 'Users', actions: { create: false, read: true, update: false, delete: false, view: true } },
  { feature: 'Settings', actions: { create: false, read: true, update: false, delete: false, view: true } },
  { feature: 'Reports', actions: { create: false, read: true, update: false, delete: false, view: true } },
  { feature: 'Activity Logs', actions: { create: false, read: true, update: false, delete: false, view: true } },
  { feature: 'Email Templates', actions: { create: false, read: true, update: false, delete: false, view: true } },
  { feature: 'Integrations', actions: { create: false, read: true, update: false, delete: false, view: true } },
];

export default function RolePermissions() {
  const [activeRole, setActiveRole] = useState(roles[0]);
  const [permissionState, setPermissionState] = useState(permissions);
  const [originalPermissions, setOriginalPermissions] = useState(JSON.parse(JSON.stringify(permissions)));
  const [isDirty, setIsDirty] = useState(false);

  const handlePermissionChange = (index, action) => {
    const newPermissions = [...permissionState];
    newPermissions[index].actions[action] = !newPermissions[index].actions[action];
    setPermissionState(newPermissions);
    
    // Check if the current state is different from the original
    const isModified = JSON.stringify(newPermissions) !== JSON.stringify(originalPermissions);
    setIsDirty(isModified);
  };

  const resetPermissions = () => {
    const resetData = JSON.parse(JSON.stringify(originalPermissions));
    setPermissionState(resetData);
    setIsDirty(false);
  };

  const savePermissions = () => {
    // Here you would typically make an API call to save the permissions
    setOriginalPermissions(JSON.parse(JSON.stringify(permissionState)));
    setIsDirty(false);
    // Add your save logic here (e.g., API call)
    console.log('Saving permissions:', permissionState);
  };

  return (
    <ProtectedRoute>
      <AdminLayout 
        title="Role Permissions" 
        description="Manage user roles and their associated permissions."
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
          <div className="p-6">
            {/* Role Tabs */}
            <div className="flex space-x-1 border-b border-gray-200 dark:border-gray-700 mb-6">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeRole === role
                      ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            {/* Permission Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      FEATURE
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      CREATE
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      READ
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      UPDATE
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      DELETE
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      VIEW
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {permissionState.map((permission, index) => (
                    <tr key={permission.feature}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {permission.feature}
                      </td>
                      {['create', 'read', 'update', 'delete', 'view'].map((action) => (
                        <td key={action} className="px-6 py-4 whitespace-nowrap text-center">
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-blue-500"
                              checked={permission.actions[action]}
                              onChange={() => handlePermissionChange(index, action)}
                            />
                            <span className="sr-only">
                              {permission.actions[action] ? 'Enabled' : 'Disabled'} {permission.feature} {action}
                            </span>
                          </label>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Note */}
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                <span className="font-medium">Note:</span> Changes made to the Admin role will affect all users assigned to it.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={resetPermissions}
                disabled={!isDirty}
                className={`border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 ${!isDirty ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Reset
              </Button>
              <Button 
                className={`bg-blue-600 hover:bg-blue-700 text-white ${!isDirty ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={savePermissions}
                disabled={!isDirty}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
