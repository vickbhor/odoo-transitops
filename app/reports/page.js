import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
  const [tripsRes, fuelRes, maintenanceRes, expensesRes, vehiclesRes] = await Promise.all([
    supabase
      .from('trips')
      .select('status, actual_distance, fuel_consumed, cargo_weight, vehicles(max_load_capacity)'),
    supabase.from('fuel_logs').select('cost, liters'),
    supabase.from('maintenance_logs').select('cost'),
    supabase.from('expenses').select('amount'),
    supabase.from('vehicles').select('status'),
  ]);

  const trips = tripsRes.data || [];
  const fuelLogs = fuelRes.data || [];
  const maintenanceLogs = maintenanceRes.data || [];
  const expenses = expensesRes.data || [];
  const vehicles = vehiclesRes.data || [];

  const completedTrips = trips.filter((t) => t.status === 'Completed');
  const activeTrips = trips.filter((t) => t.status === 'Dispatched');

  const totalDistance = completedTrips.reduce((sum, t) => sum + (Number(t.actual_distance) || 0), 0);
  const totalTripFuel = completedTrips.reduce((sum, t) => sum + (Number(t.fuel_consumed) || 0), 0);

  const totalFuelCost = fuelLogs.reduce((sum, f) => sum + (Number(f.cost) || 0), 0);
  const totalMaintenanceCost = maintenanceLogs.reduce((sum, m) => sum + (Number(m.cost) || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const totalOperationalCost = totalFuelCost + totalMaintenanceCost;

  const utilizationRates = completedTrips
    .filter((t) => t.vehicles?.max_load_capacity)
    .map((t) => (Number(t.cargo_weight) || 0) / Number(t.vehicles.max_load_capacity));
  const avgCargoUtilization = utilizationRates.length
    ? (utilizationRates.reduce((a, b) => a + b, 0) / utilizationRates.length) * 100
    : 0;

  const fleetStatusCounts = ['Available', 'On Trip', 'In Shop', 'Retired'].map((status) => ({
    status,
    count: vehicles.filter((v) => v.status === status).length,
  }));

  const kpis = [
    { label: 'Completed Trips', value: completedTrips.length, color: 'text-slate-900' },
    { label: 'Active Trips', value: activeTrips.length, color: 'text-blue-600' },
    { label: 'Distance Covered', value: `${totalDistance.toFixed(0)} km`, color: 'text-slate-900' },
    { label: 'Fuel Cost', value: `₹${totalFuelCost.toFixed(2)}`, color: 'text-amber-600' },
    { label: 'Maintenance Cost', value: `₹${totalMaintenanceCost.toFixed(2)}`, color: 'text-amber-600' },
    { label: 'Total Operational Cost', value: `₹${totalOperationalCost.toFixed(2)}`, color: 'text-red-600' },
  ];

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
        <p className="text-slate-500 text-sm mt-1">Fleet-wide operational summary</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase">{kpi.label}</p>
            <p className={`text-2xl font-extrabold mt-2 ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Trip Efficiency</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Avg Cargo Utilization</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {avgCargoUtilization.toFixed(1)}%
              </p>
              <p className="text-xs text-slate-400 mt-1">Across {completedTrips.length} completed trips</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Fuel Used on Trips</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{totalTripFuel.toFixed(1)} L</p>
              <p className="text-xs text-slate-400 mt-1">From completed trip logs</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase">Other Expenses</p>
            <p className="text-xl font-bold text-slate-900 mt-1">₹{totalExpenses.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-xl">
          <h3 className="font-bold mb-4">Fleet Status</h3>
          <div className="space-y-3">
            {fleetStatusCounts.map((s) => (
              <div
                key={s.status}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800 border border-slate-700"
              >
                <span className="text-sm text-slate-300">{s.status}</span>
                <span className="text-sm font-bold text-white">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}