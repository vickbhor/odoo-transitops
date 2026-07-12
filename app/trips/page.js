import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import TripActions from './TripActions';

export const dynamic = 'force-dynamic';

const statusStyles = {
  Draft: 'bg-slate-200 text-slate-700',
  Dispatched: 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

export default async function TripsPage() {
  const { data: trips, error } = await supabase
    .from('trips')
    .select('*, vehicles(registration_number, name_model), drivers(name, license_number)')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Trips</h1>
          <p className="text-slate-500 text-sm mt-1">{trips?.length ?? 0} trips</p>
        </div>
        <Link
          href="/trips/new"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          + New Trip
        </Link>
      </div>

      {error && <p className="text-red-600 text-sm mb-4">Couldn't load trips: {error.message}</p>}

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Route</th>
              <th className="px-4 py-3 font-medium">Vehicle</th>
              <th className="px-4 py-3 font-medium">Driver</th>
              <th className="px-4 py-3 font-medium">Cargo (kg)</th>
              <th className="px-4 py-3 font-medium">Planned Dist. (km)</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {trips?.map((trip) => (
              <tr key={trip.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {trip.source} <span className="text-slate-400">→</span> {trip.destination}
                </td>
                <td className="px-4 py-3">
                  {trip.vehicles?.registration_number}{' '}
                  <span className="text-slate-400">— {trip.vehicles?.name_model}</span>
                </td>
                <td className="px-4 py-3">{trip.drivers?.name}</td>
                <td className="px-4 py-3">{trip.cargo_weight}</td>
                <td className="px-4 py-3">{trip.planned_distance}</td>
                <td className="px-4 py-3">{new Date(trip.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                      statusStyles[trip.status] || 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {trip.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <TripActions
                    tripId={trip.id}
                    vehicleId={trip.vehicle_id}
                    driverId={trip.driver_id}
                    currentStatus={trip.status}
                  />
                </td>
              </tr>
            ))}
            {trips?.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                  No trips yet — create your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}