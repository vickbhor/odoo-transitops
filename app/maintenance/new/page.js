import { supabase } from '@/lib/supabaseClient';
import NewMaintenanceForm from './NewMaintenanceForm';

export const dynamic = 'force-dynamic';

export default async function NewMaintenancePage() {
  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('id, registration_number, name_model, status')
    .neq('status', 'Retired')
    .order('registration_number', { ascending: true });

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">New Maintenance Record</h1>
      <NewMaintenanceForm vehicles={vehicles ?? []} />
    </main>
  );
}
