import { supabase } from '@/lib/supabaseClient';
import NewFuelLogForm from './NewFuelLogForm';

export const dynamic = 'force-dynamic';

export default async function NewFuelLogPage() {
  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('id, registration_number, name_model, status')
    .order('registration_number', { ascending: true });

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Log Fuel</h1>
      <NewFuelLogForm vehicles={vehicles || []} />
    </main>
  );
}