import VehicleForm from '../VehicleForm';

export default function NewVehiclePage() {
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Add Vehicle</h1>
      <VehicleForm />
    </main>
  );
}
