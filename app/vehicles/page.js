import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

const statusStyles = {
  Available: 'bg-green-100 text-green-800',
  'On Trip': 'bg-blue-100 text-blue-800',
  'In Shop': 'bg-amber-100 text-amber-800',
  Retired: 'bg-slate-200 text-slate-600',
};

export default async function VehiclesPage() {
  const { data: vehicles, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vehicles</h1>
          <p className="text-slate-500 text-sm mt-1">Fleet registry — {vehicles?.length ?? 0} vehicles</p>
        </div>
        <Link
          href="/vehicles/new"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          + Add Vehicle
        </Link>
      </div>

      {error && (
        <p className="text-red-600 text-sm mb-4">Couldn't load vehicles: {error.message}</p>
      )}

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Reg. Number</th>
              <th className="px-4 py-3 font-medium">Name / Model</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Max Load (kg)</th>
              <th className="px-4 py-3 font-medium">Odometer</th>
              <th className="px-4 py-3 font-medium">Region</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {vehicles?.map((v) => (
              <tr key={v.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{v.registration_number}</td>
                <td className="px-4 py-3">{v.name_model}</td>
                <td className="px-4 py-3">{v.type}</td>
                <td className="px-4 py-3">{v.max_load_capacity}</td>
                <td className="px-4 py-3">{v.odometer}</td>
                <td className="px-4 py-3">{v.region}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${statusStyles[v.status] || 'bg-slate-100 text-slate-600'}`}>
                    {v.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/vehicles/${v.id}/edit`} className="text-blue-600 hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {vehicles?.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                  No vehicles yet — add your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
