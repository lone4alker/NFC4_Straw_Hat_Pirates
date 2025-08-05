import React from 'react';
import { Users, UserPlus, CheckCircle, Clock } from 'lucide-react';

export default function Collaboration() {
  const teamMembers = [
    { id: 1, name: 'Jane Smith', email: 'jane.s@example.com', status: 'Active', role: 'Editor' },
    { id: 2, name: 'Peter Jones', email: 'peter.j@example.com', status: 'Pending', role: 'Viewer' },
    { id: 3, name: 'Alice Williams', email: 'alice.w@example.com', status: 'Active', role: 'Admin' },
  ];

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-white">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Collaboration</h2>
        <button className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition-colors">
          <UserPlus className="w-5 h-5" />
          Invite Teammate
        </button>
      </div>

      <p className="text-gray-600 text-lg mb-8">
        Manage your team and collaborate on drafts in real-time.
      </p>

      <div className="bg-gray-100 rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Current Team Members</h3>
        <ul className="space-y-4">
          {teamMembers.map(member => (
            <li key={member.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-700">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{member.name}</div>
                  <div className="text-sm text-gray-500">{member.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {member.status}
                </span>
                <span className="text-sm text-gray-600">{member.role}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 bg-gray-100 rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Pending Invites</h3>
        <p className="text-gray-500">You have no pending invitations at the moment.</p>
      </div>
    </div>
  );
}