'use client';
import { useEffect, useState } from 'react';
import { getProfile } from '@/lib/auth';

export default function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const userProfile = await getProfile();
      setProfile(userProfile);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) return <div className="p-8">Loading control center...</div>;

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-slate-500 mt-1">Welcome back, {profile?.name}. Here is your fleet health summary.</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Role</p>
          <p className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{profile?.role}</p>
        </div>
      </div>

      {/* Hero Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Fleet', value: '24', color: 'text-slate-900' },
          { label: 'On Road', value: '18', color: 'text-green-600' },
          { label: 'Maintenance', value: '4', color: 'text-amber-600' },
          { label: 'Critical Alerts', value: '2', color: 'text-red-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase">{stat.label}</p>
            <p className={`text-3xl font-extrabold mt-2 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Area - Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Operational Insights</h3>
          <div className="h-48 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-xl text-slate-400 text-sm">
            [Chart Area: Integrate Recharts or Lucide here for live trip data]
          </div>
        </div>
        
        <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-xl">
          <h3 className="font-bold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {['Dispatch Vehicle', 'Generate Report', 'Update Driver'].map((action, i) => (
              <button key={i} className="w-full text-left p-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm transition-all border border-slate-700">
                {action} →
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}