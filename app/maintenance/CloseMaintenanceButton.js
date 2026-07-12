'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function CloseMaintenanceButton({ logId, vehicleId }) {
  const router = useRouter();
  const [closing, setClosing] = useState(false);
  const [error, setError] = useState('');

  async function handleClose() {
    setClosing(true);
    setError('');

    const { error: logError } = await supabase
      .from('maintenance_logs')
      .update({ status: 'Closed', closed_at: new Date().toISOString() })
      .eq('id', logId);

    if (logError) {
      setError(logError.message);
      setClosing(false);
      return;
    }

    const { data: vehicle, error: fetchError } = await supabase
      .from('vehicles')
      .select('status')
      .eq('id', vehicleId)
      .single();

    if (!fetchError && vehicle && vehicle.status !== 'Retired') {
      await supabase.from('vehicles').update({ status: 'Available' }).eq('id', vehicleId);
    }

    setClosing(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleClose}
        disabled={closing}
        className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
      >
        {closing ? 'Closing...' : 'Close'}
      </button>
      {error && <p className="text-red-600 text-xs">{error}</p>}
    </div>
  );
}
