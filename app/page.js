import Link from 'next/link';

const modules = [
  { href: '/vehicles', label: 'Vehicles', desc: 'Registry, status, capacity' },
  { href: '/maintenance', label: 'Maintenance', desc: 'Service logs & shop status' },
  { href: '/fuel-expenses', label: 'Fuel & Expenses', desc: 'Fuel logs, tolls, operational cost' },
  { href: '/reports', label: 'Reports', desc: 'Efficiency, utilization, ROI' },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">TransitOps</h1>
      <p className="text-slate-600 mb-8">Fleet operations platform — leader track modules</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        {modules.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="block rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition"
          >
            <h2 className="text-lg font-semibold text-slate-900">{m.label}</h2>
            <p className="text-sm text-slate-500 mt-1">{m.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
