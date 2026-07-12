'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function NewFuelLogForm({ vehicles }) {
  const router = useRouter();
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id ?? '');
  const [liters, setLiters] = useState('');
  const [cost, setCost] = useState('');
  const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 10));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const e = {};
    if (!vehicleId) e.vehicleId = 'Select a vehicle';
    if (!liters || Number(liters) <= 0) e.liters = 'Enter a valid amount';
    if (!cost || Number(cost) <= 0) e.cost = 'Enter a valid cost';
    if (!logDate) e.logDate = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setFormError('');
    if (!validate()) return;
    setSubmitting(true);

    const { error: insertError } = await supabase.from('fuel_logs').insert({
      vehicle_id: vehicleId,
      liters: Number(liters),
      cost: Number(cost),
      log_date: logDate,
    });

    setSubmitting(false);

    if (insertError) {
      setFormError(insertError.message);
      return;
    }

    router.push('/fuel-expenses');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      {formError && <p className="text-red-600 text-sm">{formError}</p>}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle</label>
        <select
          value={vehicleId}
          onChange={(e) => setVehicleId(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          {vehicles.length === 0 && <option value="">No vehicles found</option>}
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.registration_number} — {v.name_model} ({v.status})
            </option>
          ))}
        </select>
        {errors.vehicleId && <p className="text-red-600 text-xs mt-1">{errors.vehicleId}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Liters</label>
          <input
            type="number"
            step="0.01"
            value={liters}
            onChange={(e) => setLiters(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="e.g. 45.5"
          />
          {errors.liters && <p className="text-red-600 text-xs mt-1">{errors.liters}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Cost</label>
          <input
            type="number"
            step="0.01"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="e.g. 4500"
          />
          {errors.cost && <p className="text-red-600 text-xs mt-1">{errors.cost}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
        <input
          type="date"
          value={logDate}
          onChange={(e) => setLogDate(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        {errors.logDate && <p className="text-red-600 text-xs mt-1">{errors.logDate}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting || vehicles.length === 0}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {submitting ? 'Saving...' : 'Log Fuel'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/fuel-expenses')}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}