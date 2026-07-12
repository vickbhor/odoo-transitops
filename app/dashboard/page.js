"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function DashboardData() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'Fleet Manager'; // Dynamic role fetching

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0f172a] mb-2">Overview</h1>
          <p className="text-slate-500">Welcome back, {role} (Demo). Here is your fleet health summary.</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Active Role</span>
          <span className="bg-blue-50 text-blue-600 font-semibold px-4 py-1.5 rounded-full text-sm">
            {role}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Stat Cards */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Fleet</h3>
          <p className="text-4xl font-bold text-[#0f172a]">24</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">On Road</h3>
          <p className="text-4xl font-bold text-emerald-500">18</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Maintenance</h3>
          <p className="text-4xl font-bold text-orange-500">4</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Critical Alerts</h3>
          <p className="text-4xl font-bold text-red-600">2</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-[#0f172a] mb-4">Operational Insights</h2>
          <div className="h-64 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center bg-slate-50">
            <p className="text-slate-400 text-sm">[Chart Area: Integrate Recharts or Lucide here for live trip data]</p>
          </div>
        </div>

        <div className="bg-[#0f172a] rounded-xl shadow-lg p-6 text-white">
          <h2 className="text-lg font-bold mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full text-left bg-slate-800 hover:bg-slate-700 px-5 py-4 rounded-lg border border-slate-700 transition-colors text-sm font-medium text-slate-200 flex justify-between items-center">
              Dispatch Vehicle <span>&rarr;</span>
            </button>
            <button className="w-full text-left bg-slate-800 hover:bg-slate-700 px-5 py-4 rounded-lg border border-slate-700 transition-colors text-sm font-medium text-slate-200 flex justify-between items-center">
              Generate Report <span>&rarr;</span>
            </button>
            <button className="w-full text-left bg-slate-800 hover:bg-slate-700 px-5 py-4 rounded-lg border border-slate-700 transition-colors text-sm font-medium text-slate-200 flex justify-between items-center">
              Update Driver <span>&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-500">Loading dashboard...</div>}>
      <DashboardData />
    </Suspense>
  );
}