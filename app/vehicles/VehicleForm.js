'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

const VEHICLE_TYPES = ['Truck', 'Van', 'Bus', 'Car', 'Trailer'];
const STATUS_OPTIONS = ['Available', 'On Trip', 'In Shop', 'Retired'];

export default function VehicleForm({ initialData = null }) {
  const router = useRouter();
  const isEdit = Boolean(initialData?.id);

  const [form, setForm] = useState({
    registration_number: initialData?.registration_number ?? '',
    name_model: initialData?.name_model ?? '',
    type: initialData?.type ?? VEHICLE_TYPES[0],
    max_load_capacity: initialData?.max_load_capacity ?? '',
    odometer: initialData?.odometer ?? 0,
    acquisition_cost: initialData?.acquisition_cost ?? '',
    region: initialData?.region ?? '',
    status: initialData?.status ?? 'Available',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const e = {};
    if (!form.registration_number.trim()) e.registration_number = 'Required';
    if (!form.name_model.trim()) e.name_model = 'Required';
    if (!form.max_load_capacity || Number(form.max_load_capacity) <= 0)
      e.max_load_capacity = 'Must be greater than 0';
    if (form.acquisition_cost === '' || Number(form.acquisition_cost) < 0)
      e.acquisition_cost = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setFormError('');
    if (!validate()) return;

    setSubmitting(true);

    let dupQuery = supabase
      .from('vehicles')
      .select('id')
      .eq('registration_number', form.registration_number.trim());
    if (isEdit) dupQuery = dupQuery.neq('id', initialData.id);
    const { data: dup, error: dupError } = await dupQuery;

    if (dupError) {
      setFormError(dupError.message);
      setSubmitting(false);
      return;
    }
    if (dup && dup.length > 0) {
      setErrors((e) => ({ ...e, registration_number: 'Already in use by another vehicle' }));
      setSubmitting(false);
      return;
    }

    const payload = {
      registration_number: form.registration_number.trim(),
      name_model: form.name_model.trim(),
      type: form.type,
      max_load_capacity: Number(form.max_load_capacity),
      odometer: Number(form.odometer) || 0,
      acquisition_cost: Number(form.acquisition_cost),
      region: form.region.trim(),
      status: form.status,
    };

    const { error } = isEdit
      ? await supabase.from('vehicles').update(payload).eq('id', initialData.id)
      : await supabase.from('vehicles').insert(payload);

    setSubmitting(false);

    if (error) {
      if (error.code === '23505') {
        setErrors((e) => ({ ...e, registration_number: 'Already in use by another vehicle' }));
      } else {
        setFormError(error.message);
      }
      return;
    }

    router.push('/vehicles');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      {formError && <p className="text-red-600 text-sm">{formError}</p>}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Registration Number</label>
        <input
          type="text"
          value={form.registration_number}
          onChange={(e) => update('registration_number', e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          placeholder="e.g. VAN-05"
        />
        {errors.registration_number && <p className="text-red-600 text-xs mt-1">{errors.registration_number}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Name / Model</label>
        <input
          type="text"
          value={form.name_model}
          onChange={(e) => update('name_model', e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          placeholder="e.g. Tata Ace"
        />
        {errors.name_model && <p className="text-red-600 text-xs mt-1">{errors.name_model}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
          <select
            value={form.type}
            onChange={(e) => update('type', e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {VEHICLE_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Region</label>
          <input
            type="text"
            value={form.region}
            onChange={(e) => update('region', e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="e.g. North"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Max Load (kg)</label>
          <input
            type="number"
            value={form.max_load_capacity}
            onChange={(e) => update('max_load_capacity', e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          {errors.max_load_capacity && <p className="text-red-600 text-xs mt-1">{errors.max_load_capacity}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Odometer</label>
          <input
            type="number"
            value={form.odometer}
            onChange={(e) => update('odometer', e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Acquisition Cost</label>
          <input
            type="number"
            value={form.acquisition_cost}
            onChange={(e) => update('acquisition_cost', e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          {errors.acquisition_cost && <p className="text-red-600 text-xs mt-1">{errors.acquisition_cost}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
        <select
          value={form.status}
          onChange={(e) => update('status', e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Vehicle'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/vehicles')}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
