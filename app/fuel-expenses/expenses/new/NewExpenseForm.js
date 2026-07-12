'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

const EXPENSE_TYPES = ['Toll', 'Parking', 'Fine', 'Other'];

export default function NewExpenseForm({ vehicles }) {
  const router = useRouter();
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id ?? '');
  const [type, setType] = useState(EXPENSE_TYPES[0]);
  const [amount, setAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const e = {};
    if (!vehicleId) e.vehicleId = 'Select a vehicle';
    if (!amount || Number(amount) <= 0) e.amount = 'Enter a valid amount';
    if (!expenseDate) e.expenseDate = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setFormError('');
    if (!validate()) return;
    setSubmitting(true);

    const { error: insertError } = await supabase.from('expenses').insert({
      vehicle_id: vehicleId,
      type,
      amount: Number(amount),
      expense_date: expenseDate,
      description: description.trim() || null,
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
          <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {EXPENSE_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="e.g. 250"
          />
          {errors.amount && <p className="text-red-600 text-xs mt-1">{errors.amount}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
        <input
          type="date"
          value={expenseDate}
          onChange={(e) => setExpenseDate(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        {errors.expenseDate && <p className="text-red-600 text-xs mt-1">{errors.expenseDate}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description (optional)</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          placeholder="e.g. Mumbai-Pune expressway toll"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting || vehicles.length === 0}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {submitting ? 'Saving...' : 'Log Expense'}
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