"use client";

import React from 'react';
import RoleGate from '@/components/RoleGate';

const AuditPage: React.FC = () => {
  return (
    <RoleGate allowedRoles={["admin"]} fallback={
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] p-4">
        <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          You do not have permission to view the Audit Log.
        </p>
      </div>
    }>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] p-4">
        <h1 className="text-4xl font-bold mb-4">Audit Log Page</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          This is a placeholder for the audit log. Only administrators can view this page.
        </p>
      </div>
    </RoleGate>
  );
};

export default AuditPage;