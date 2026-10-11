'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        // Force a hard navigation to bypass router cache and hit middleware
        window.location.href = '/admin';
      } else {
        setError('Invalid username or password.');
        setIsLoading(false);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-secondary/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-10">
          <Logo size="md" />
        </div>

        <div className="bg-bg-surface/80 backdrop-blur-xl border border-border-subtle rounded-2xl p-8 shadow-card">
          <div className="flex items-center gap-3 mb-6 border-b border-border-subtle pb-4">
            <div className="h-10 w-10 rounded-full bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
              <Lock className="w-5 h-5 text-brand-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-text-primary tracking-wide">Admin Portal</h1>
              <p className="text-xs text-text-muted">Secure CMS Access</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
                className="w-full bg-bg-base border border-border-subtle rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full bg-bg-base border border-border-subtle rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-brand-rose/10 border border-brand-rose/20 text-brand-rose text-sm px-4 py-3 rounded-lg flex items-start gap-2">
                <span className="font-bold">Error:</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-primary hover:opacity-90 text-text-primary font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-glow disabled:opacity-50 mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Secure Login</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-text-muted text-xs mt-8">
          AIX Summit 2026. Content Management System.
        </p>
      </div>
    </div>
  );
}
