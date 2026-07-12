import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import CloseMaintenanceButton from './CloseMaintenanceButton';

export const dynamic = 'force-dynamic';

export default async function MaintenancePage() {
  const { data: logs, error } = await supabase
    .from('maintenance_logs')
    .select('*, vehicles(registration_number, name_model, status)')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Maintenance</h1>
          <p className="text-slate-500 text-sm mt-1">{logs?.length ?? 0} records</p>
        </div>
        <Link
          href="/maintenance/new"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          + New Maintenance Record
        </Link>
      </div>

      {error && <p className="text-red-600 text-sm mb-4">Couldn't load records: {error.message}</p>}

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Vehicle</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Cost</th>
              <th className="px-4 py-3 font-medium">Opened</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs?.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {log.vehicles?.registration_number}{' '}
                  <span className="text-slate-400 font-normal">— {log.vehicles?.name_model}</span>
                </td>
                <td className="px-4 py-3">{log.description}</td>
                <td className="px-4 py-3">{log.cost != null ? `₹${log.cost}` : '—'}</td>
                <td className="px-4 py-3">{new Date(log.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                      log.status === 'Active' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {log.status === 'Active' && (
                    <CloseMaintenanceButton logId={log.id} vehicleId={log.vehicle_id} />
                  )}
                </td>
              </tr>
            ))}
            {logs?.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  No maintenance records yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
