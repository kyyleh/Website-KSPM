import { useState } from 'react';
import { Lock, User, LogIn, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { login } from './lib/adminApi';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !password) {
      setError('User ID dan password harus diisi');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await login(userId, password);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Login gagal. Periksa User ID dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="absolute -bottom-[30%] -left-[10%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full bg-amber-600/10 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1000px] rounded-full bg-amber-400/[0.03] blur-[100px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Login card */}
      <div className="relative w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Brand header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-6">
            <img src="/images/kspm-logo.png" alt="KSPM Logo" className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Admin Portal</h1>
          <p className="text-sm text-amber-400/80 font-medium tracking-wide uppercase">Content Management System</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 sm:p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden">
          {/* subtle inner glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none rounded-[2rem]" />
          
          <div className="mb-8 text-center relative z-10">
            <h2 className="text-2xl font-semibold text-white tracking-tight">Selamat Datang</h2>
            <p className="text-sm text-slate-400 mt-2">Silakan masuk dengan kredensial admin Anda</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* User ID */}
            <div className="group">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 group-focus-within:text-amber-400 transition-colors">User ID</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-400 transition-colors" />
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Masukkan User ID..."
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-950/60 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all hover:bg-slate-950/80"
                  autoComplete="username"
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div className="group">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 group-focus-within:text-amber-400 transition-colors">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-400 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-950/60 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all hover:bg-slate-950/80"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-amber-500 text-slate-950 font-bold text-[15px] rounded-2xl hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_10px_20px_-10px_rgba(245,158,11,0.5)] hover:shadow-[0_15px_25px_-10px_rgba(245,158,11,0.6)] hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Otentikasi…</span>
                  </>
                ) : (
                  <>
                    <LogIn size={18} className="mr-1" />
                    <span>Masuk Dashboard</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 mt-6">
          © 2019 — 2026 KSPM FEB UIKA Bogor
        </p>
      </div>
    </div>
  );
}
