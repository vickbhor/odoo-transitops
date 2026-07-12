import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export default async function FuelExpensesPage() {
  const { data: vehicles, error: vehiclesError } = await supabase
    .from('vehicles')
    .select(`
      id,
      registration_number,
      name_model,
      status,
      fuel_logs(liters, cost),
      expenses(amount),
      maintenance_logs(cost)
    `)
    .order('registration_number', { ascending: true });

  const { data: recentFuel, error: fuelError } = await supabase
    .from('fuel_logs')
    .select('*, vehicles(registration_number, name_model)')
    .order('log_date', { ascending: false })
    .limit(10);

  const { data: recentExpenses, error: expensesError } = await supabase
    .from('expenses')
    .select('*, vehicles(registration_number, name_model)')
    .order('expense_date', { ascending: false })
    .limit(10);

  const summary = (vehicles || []).map((v) => {
    const totalFuelCost = (v.fuel_logs || []).reduce((sum, f) => sum + (Number(f.cost) || 0), 0);
    const totalMaintenanceCost = (v.maintenance_logs || []).reduce((sum, m) => sum + (Number(m.cost) || 0), 0);
    const totalExpenses = (v.expenses || []).reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    return {
      id: v.id,
      registration_number: v.registration_number,
      name_model: v.name_model,
      status: v.status,
      totalFuelCost,
      totalMaintenanceCost,
      totalExpenses,
      totalOperationalCost: totalFuelCost + totalMaintenanceCost,
    };
  });

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Fuel & Expenses</h1>
          <p className="text-slate-500 text-sm mt-1">Operational cost tracking per vehicle</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/fuel-expenses/fuel/new"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            + Log Fuel
          </Link>
          <Link
            href="/fuel-expenses/expenses/new"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            + Log Expense
          </Link>
        </div>
      </div>

      {(vehiclesError || fuelError || expensesError) && (
        <p className="text-red-600 text-sm mb-4">
          Couldn't load some data: {vehiclesError?.message || fuelError?.message || expensesError?.message}
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white mb-2">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Vehicle</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Fuel Cost</th>
              <th className="px-4 py-3 font-medium">Maintenance Cost</th>
              <th className="px-4 py-3 font-medium">Total Operational Cost</th>
              <th className="px-4 py-3 font-medium">Other Expenses</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {summary.map((v) => (
              <tr key={v.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {v.registration_number} <span className="text-slate-400 font-normal">— {v.name_model}</span>
                </td>
                <td className="px-4 py-3">{v.status}</td>
                <td className="px-4 py-3">₹{v.totalFuelCost.toFixed(2)}</td>
                <td className="px-4 py-3">₹{v.totalMaintenanceCost.toFixed(2)}</td>
                <td className="px-4 py-3 font-semibold text-slate-900">₹{v.totalOperationalCost.toFixed(2)}</td>
                <td className="px-4 py-3 text-slate-500">₹{v.totalExpenses.toFixed(2)}</td>
              </tr>
            ))}
            {summary.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  No vehicles yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400 mb-8">
        Total Operational Cost = Fuel Cost + Maintenance Cost. Other Expenses shown separately.
      </p>

      <h2 className="text-lg font-semibold text-slate-900 mb-3">Recent Fuel Logs</h2>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white mb-8">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Vehicle</th>
              <th className="px-4 py-3 font-medium">Liters</th>
              <th className="px-4 py-3 font-medium">Cost</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(recentFuel || []).map((f) => (
              <tr key={f.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {f.vehicles?.registration_number}{' '}
                  <span className="text-slate-400 font-normal">— {f.vehicles?.name_model}</span>
                </td>
                <td className="px-4 py-3">{f.liters}L</td>
                <td className="px-4 py-3">₹{f.cost}</td>
                <td className="px-4 py-3">{f.log_date}</td>
              </tr>
            ))}
            {(recentFuel || []).length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                  No fuel logs yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h2 className="text-lg font-semibold text-slate-900 mb-3">Recent Expenses</h2>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Vehicle</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(recentExpenses || []).map((e) => (
              <tr key={e.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {e.vehicles?.registration_number}{' '}
                  <span className="text-slate-400 font-normal">— {e.vehicles?.name_model}</span>
                </td>
                <td className="px-4 py-3">{e.type}</td>
                <td className="px-4 py-3">₹{e.amount}</td>
                <td className="px-4 py-3">{e.expense_date}</td>
                <td className="px-4 py-3 text-slate-500">{e.description}</td>
              </tr>
            ))}
            {(recentExpenses || []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  No expenses logged yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}