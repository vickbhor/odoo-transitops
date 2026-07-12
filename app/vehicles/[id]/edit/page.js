import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import VehicleForm from '../../VehicleForm';

export const dynamic = 'force-dynamic';

export default async function EditVehiclePage({ params }) {
  const { id } = await params;
  const { data: vehicle, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !vehicle) notFound();

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Edit Vehicle</h1>
      <VehicleForm initialData={vehicle} />
    </main>
  );
}
