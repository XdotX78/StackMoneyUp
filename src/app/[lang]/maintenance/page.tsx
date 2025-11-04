'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function MaintenancePage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/maintenance/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Invalid password');
      }

      // Verify response is successful (data not needed)
      await response.json();

      // Success - redirect to home page
      router.refresh();
      window.location.href = '/en';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid password. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" 
      style={{ 
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)'
      }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/4 -left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
                  style={{ backgroundColor: '#00ff00' }}
        />
        <div 
          className="absolute bottom-1/4 -right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
                  style={{ backgroundColor: '#00ff00' }}
        />
      </div>

      <div className="w-full max-w-md relative z-10 px-4">
        <div 
          className="bg-white rounded-2xl p-8 sm:p-10 border-2 shadow-2xl"
          style={{ 
            borderColor: '#00ff00',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(0, 255, 0, 0.1)'
          }}
        >
          <div className="text-center mb-8">
            <div className="mb-8">
              <div className="mb-6">
                <svg 
                  className="w-24 h-24 mx-auto mb-6 text-gray-800" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                  />
                </svg>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black mb-4 text-gray-900 leading-tight">
                Site Under<br />Maintenance
              </h1>
              <div className="w-20 h-1.5 mx-auto mt-4 mb-6 bg-green-500 rounded-full" />
            </div>
            <div className="space-y-3 mb-2">
              <p className="text-gray-700 text-lg font-semibold">
                We&apos;re working on something awesome!
              </p>
              <p className="text-gray-600 text-base leading-relaxed max-w-md mx-auto">
                This website is currently undergoing maintenance.<br />
                Please enter the authorized password below to access the site.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="px-4 py-3 rounded-lg bg-red-50 border-2 border-red-300 text-red-700 flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3">
              <label className="block text-base font-bold text-gray-800">
                Maintenance Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter the maintenance password"
                  required
                  disabled={loading}
                  className="w-full pl-14 pr-4 py-4 text-base bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-3 focus:ring-green-400 focus:border-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  style={{
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                  }}
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full font-black text-lg py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white uppercase tracking-wide"
              style={{
                background: loading 
                  ? '#6b7280' 
                  : 'linear-gradient(135deg, #00ff00 0%, #00cc00 100%)',
                boxShadow: loading ? 'none' : '0 12px 30px rgba(0, 255, 0, 0.4)'
              }}
            >
              {loading ? 'Verifying Password...' : 'Access Site'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t-2 border-gray-200">
            <div className="flex items-start justify-center gap-3 text-xs text-gray-600">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-center leading-relaxed">
                This site is currently in maintenance mode.<br />
                <span className="font-semibold">Only authorized personnel with the correct password can access it.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

