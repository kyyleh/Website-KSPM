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
    <div className="min-h-screen bg-[#f0ede6] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full bg-amber-500/5 blur-[120px]" />
        <div className="absolute -bottom-[30%] -left-[10%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full bg-amber-600/5 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1000px] rounded-full bg-amber-400/[0.01] blur-[100px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Login card */}
      <div className="relative w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Brand header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-4">
            <img src="/images/kspm-logo.png" alt="KSPM Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(195,147,49,0.25)]" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#1c1515] tracking-tight mb-1">Admin Portal</h1>
          <p className="text-xs text-[#a67e2a] font-semibold tracking-widest uppercase">Content Management System</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#eae6dd] rounded-[2rem] p-8 sm:p-10 shadow-[0_20px_50px_rgba(28,21,21,0.06)] relative overflow-hidden">
          {/* subtle inner glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/[0.01] to-transparent pointer-events-none rounded-[2rem]" />
          
          <div className="mb-8 text-center relative z-10">
            <h2 className="text-xl font-bold text-[#1c1515] tracking-tight">Selamat Datang</h2>
            <p className="text-xs text-neutral-500 mt-2">Silakan masuk dengan kredensial admin Anda</p>
          </div>

          {/* Error */}
          {error && (
            <div role="alert" className="mb-5 flex items-start gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
              <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* User ID */}
            <div className="group">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2 group-focus-within:text-[#a67e2a] transition-colors">User ID</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#a67e2a] transition-colors" />
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Masukkan User ID..."
                  className="w-full pl-12 pr-4 py-3.5 bg-[#faf9f5] border border-[#d2cbbe] rounded-2xl text-[#1c1515] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#a67e2a]/20 focus:border-[#a67e2a] transition-all hover:bg-white"
                  autoComplete="username"
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div className="group">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2 group-focus-within:text-[#a67e2a] transition-colors">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#a67e2a] transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-[#faf9f5] border border-[#d2cbbe] rounded-2xl text-[#1c1515] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#a67e2a]/20 focus:border-[#a67e2a] transition-all hover:bg-white"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#a67e2a] transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#dcae44] to-[#b88c2b] text-white font-bold text-[15px] rounded-2xl hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-[#a67e2a]/50 focus:ring-offset-2 focus:ring-offset-white transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_10px_20px_-5px_rgba(195,147,49,0.2)] hover:shadow-[0_12px_22px_-5px_rgba(195,147,49,0.3)] hover:-translate-y-0.5 active:translate-y-0"
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
        <p className="text-center text-xs text-neutral-400 mt-8">
          © 2019 — 2026 KSPM FEB UIKA Bogor
        </p>
      </div>
    </div>
  );
}
