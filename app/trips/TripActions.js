'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function TripActions({ tripId, vehicleId, driverId, currentStatus }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function updateTrip(fields) {
    setLoading(true);
    setError('');
    const { error: tripError } = await supabase.from('trips').update(fields).eq('id', tripId);
    if (tripError) {
      setError(tripError.message);
      setLoading(false);
      return false;
    }
    return true;
  }

  async function setPartyStatus(status) {
    await supabase.from('vehicles').update({ status }).eq('id', vehicleId);
    await supabase.from('drivers').update({ status }).eq('id', driverId);
  }

  async function handleDispatch() {
    const ok = await updateTrip({ status: 'Dispatched', dispatched_at: new Date().toISOString() });
    if (!ok) return;
    await setPartyStatus('On Trip');
    setLoading(false);
    router.refresh();
  }

  async function handleComplete() {
    const ok = await updateTrip({ status: 'Completed', completed_at: new Date().toISOString() });
    if (!ok) return;
    await setPartyStatus('Available');
    setLoading(false);
    router.refresh();
  }

  async function handleCancel() {
    if (!confirm('Cancel this trip?')) return;
    const ok = await updateTrip({ status: 'Cancelled' });
    if (!ok) return;
    // Only free the vehicle/driver if this trip had actually locked them
    if (currentStatus === 'Dispatched') {
      await setPartyStatus('Available');
    }
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        {currentStatus === 'Draft' && (
          <button
            onClick={handleDispatch}
            disabled={loading}
            className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '...' : 'Dispatch'}
          </button>
        )}
        {currentStatus === 'Dispatched' && (
          <button
            onClick={handleComplete}
            disabled={loading}
            className="rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? '...' : 'Complete'}
          </button>
        )}
        {(currentStatus === 'Draft' || currentStatus === 'Dispatched') && (
          <button
            onClick={handleCancel}
            disabled={loading}
            className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
      {error && <p className="text-red-600 text-xs">{error}</p>}
    </div>
  );
}