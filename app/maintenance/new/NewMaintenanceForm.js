'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function NewMaintenanceForm({ vehicles }) {
  const router = useRouter();
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id ?? '');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const e = {};
    if (!vehicleId) e.vehicleId = 'Select a vehicle';
    if (!description.trim()) e.description = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setFormError('');
    if (!validate()) return;
    setSubmitting(true);

    const { data: existing, error: existingError } = await supabase
      .from('maintenance_logs')
      .select('id')
      .eq('vehicle_id', vehicleId)
      .eq('status', 'Active');

    if (existingError) {
      setFormError(existingError.message);
      setSubmitting(false);
      return;
    }
    if (existing && existing.length > 0) {
      setFormError('This vehicle already has an active maintenance record. Close it before opening a new one.');
      setSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from('maintenance_logs').insert({
      vehicle_id: vehicleId,
      description: description.trim(),
      cost: cost === '' ? null : Number(cost),
      status: 'Active',
    });

    if (insertError) {
      setFormError(insertError.message);
      setSubmitting(false);
      return;
    }

    const { error: vehicleError } = await supabase
      .from('vehicles')
      .update({ status: 'In Shop' })
      .eq('id', vehicleId);

    setSubmitting(false);

    if (vehicleError) {
      setFormError(`Record created, but vehicle status update failed: ${vehicleError.message}`);
      return;
    }

    router.push('/maintenance');
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
          {vehicles.length === 0 && <option value="">No vehicles available</option>}
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.registration_number} — {v.name_model} ({v.status})
            </option>
          ))}
        </select>
        {errors.vehicleId && <p className="text-red-600 text-xs mt-1">{errors.vehicleId}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          placeholder="e.g. Brake pad replacement"
        />
        {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Cost</label>
        <input
          type="number"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          placeholder="optional"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting || vehicles.length === 0}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {submitting ? 'Saving...' : 'Create Record'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/maintenance')}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
