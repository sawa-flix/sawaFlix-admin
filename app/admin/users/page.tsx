'use client';

import React, { useState } from 'react';
import { Users, Search, MoreVertical, ShieldCheck, Mail } from 'lucide-react';

export default function AdminUsersPage() {
  const [users] = useState([
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Viewer', joined: 'Aug 15, 2026', status: 'Active' },
    { id: '2', name: 'Amara Kone', email: 'amara@creators.africa', role: 'Creator', joined: 'Aug 20, 2026', status: 'Active' },
    { id: '3', name: 'Kwame Mensah', email: 'kwame@media.gh', role: 'Admin', joined: 'Jul 10, 2026', status: 'Active' },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Management</h1>
        <p className="text-xs text-slate-500 mt-1">Platform viewers, role assignments, and account permissions.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{u.name}</div>
                    <div className="text-[11px] text-slate-400">{u.email}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-600">{u.role}</td>
                  <td className="py-3.5 px-4 text-slate-500">{u.joined}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="p-1 text-slate-400 hover:text-slate-600 rounded">
                      <MoreVertical size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
