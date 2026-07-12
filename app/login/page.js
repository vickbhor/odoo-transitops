'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Demo1234!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-slate-200">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 text-center">TransitOps Login</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Demo Role Account</label>
            <select 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 bg-white"
              required
            >
              <option value="" disabled>Select a role to test...</option>
              <option value="fleet.manager@example.com">Fleet Manager</option>
              <option value="driver@example.com">Driver</option>
              <option value="safety.officer@example.com">Safety Officer</option>
              <option value="financial.analyst@example.com">Financial Analyst</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded bg-slate-50 text-slate-500"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading || !email}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}