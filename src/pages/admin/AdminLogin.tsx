import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, Key, ShieldCheck, UserPlus, AlertCircle, CheckCircle, User as UserIcon } from 'lucide-react';
import { loginAdmin, registerAdmin, sendAdminPasswordReset, getFirebaseAuthErrorMessage } from '../../firebase/auth';
import { SeoMeta } from '../../components/common/SeoMeta';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/admin';

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [displayName, setDisplayName] = useState('Store Admin');
  const [email, setEmail] = useState('admin@90schyaathavanijewellery.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Forgot password modal
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('admin@90schyaathavanijewellery.com');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        await loginAdmin(email.trim(), password);
        navigate(from, { replace: true });
      } else {
        await registerAdmin(email.trim(), password, displayName.trim());
        setSuccessMsg('Admin account created successfully! Redirecting to Dashboard...');
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 800);
      }
    } catch (err: any) {
      console.error('Firebase Auth error:', err);
      const friendlyError = getFirebaseAuthErrorMessage(err);
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    try {
      await sendAdminPasswordReset(resetEmail.trim());
      setResetSuccess(true);
    } catch (err: any) {
      alert(`Password reset failed: ${getFirebaseAuthErrorMessage(err)}`);
    } finally {
      setResetLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@90schyaathavanijewellery.com');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#14110E] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <SeoMeta title="Admin Portal | 90s chya athavani Jewellery" />

      {/* Decorative background aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#BA9541]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#947127] to-[#D4AF37] flex items-center justify-center text-white font-serif font-bold text-xl shadow-xl mx-auto mb-3">
            90s
          </div>
          <h1 className="font-display font-bold text-xl sm:text-2xl text-[#FAF8F5] tracking-wider uppercase">
            90s CHYA ATHAVANI
          </h1>
          <p className="text-xs text-[#BA9541] tracking-widest uppercase font-semibold mt-0.5">
            Admin Management Console
          </p>
        </div>

        {/* Login / Register Card */}
        <div className="bg-[#1F1A16] border border-[#3B3228] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#16120E] rounded-xl border border-[#332A22]">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setError(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'signin'
                  ? 'bg-[#D4AF37] text-[#191512] shadow'
                  : 'text-[#A89E90] hover:text-[#FAF8F5]'
              }`}
            >
              Admin Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'register'
                  ? 'bg-[#D4AF37] text-[#191512] shadow'
                  : 'text-[#A89E90] hover:text-[#FAF8F5]'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Admin</span>
            </button>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-[#332A22]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[11px] font-bold text-[#E8E2D8] uppercase tracking-wider">
                Firebase Auth &bull; fir-jewl
              </span>
            </div>
            {mode === 'signin' && (
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[10px] font-semibold text-[#D4AF37] hover:underline bg-[#2B231B] px-2 py-0.5 rounded border border-[#44382C]"
              >
                Demo Fill
              </button>
            )}
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-700 text-emerald-200 text-xs flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-[#C8BDAE] uppercase tracking-wider mb-1.5">
                  Admin Display Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#8C7F70] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Master Store Manager"
                    className="w-full pl-10 pr-4 py-3 bg-[#16120E] border border-[#3E342A] focus:border-[#BA9541] rounded-xl text-sm text-[#FAF8F5] focus:outline-none transition-all placeholder:text-[#6E6356]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#C8BDAE] uppercase tracking-wider mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8C7F70] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@90schyaathavanijewellery.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#16120E] border border-[#3E342A] focus:border-[#BA9541] rounded-xl text-sm text-[#FAF8F5] focus:outline-none transition-all placeholder:text-[#6E6356]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#C8BDAE] uppercase tracking-wider">
                  Admin Password
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetOpen(true);
                      setResetSuccess(false);
                    }}
                    className="text-[11px] text-[#D4AF37] hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Key className="w-4 h-4 text-[#8C7F70] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-[#16120E] border border-[#3E342A] focus:border-[#BA9541] rounded-xl text-sm text-[#FAF8F5] focus:outline-none transition-all placeholder:text-[#6E6356]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              id="admin-login-submit-btn"
              className="w-full py-3.5 px-4 rounded-xl font-display font-bold text-sm text-[#191512] bg-[#D4AF37] hover:bg-[#c29e2f] active:scale-[0.99] disabled:opacity-50 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  <span>{mode === 'signin' ? 'Authenticating...' : 'Creating Admin Account...'}</span>
                </div>
              ) : mode === 'signin' ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>SIGN IN TO ADMIN PANEL</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>CREATE ADMIN ACCOUNT</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link
              to="/"
              className="text-xs text-[#8C8072] hover:text-[#D4AF37] transition-colors inline-flex items-center gap-1"
            >
              <span>← Return to Customer Store</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Password Reset Modal */}
      {isResetOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1F1A16] border border-[#44382C] rounded-2xl max-w-sm w-full p-6 text-white space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsResetOpen(false)}
              className="absolute top-4 right-4 text-[#8C8072] hover:text-white"
            >
              ✕
            </button>

            <h3 className="font-display font-bold text-lg text-[#FAF8F5]">
              Reset Admin Password
            </h3>

            {resetSuccess ? (
              <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-700 text-emerald-300 text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Password Reset Link Sent!</span>
                </div>
                <p>Check your email inbox for instructions to reset your password.</p>
                <button
                  onClick={() => setIsResetOpen(false)}
                  className="w-full mt-2 py-2 bg-emerald-700 text-white rounded-lg font-bold text-xs"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-3">
                <p className="text-xs text-[#A89E90]">
                  Enter your registered admin email to receive a password reset link.
                </p>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#16120E] border border-[#3E342A] rounded-xl text-xs text-[#FAF8F5]"
                />
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-2.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs"
                >
                  {resetLoading ? 'Sending...' : 'Send Password Reset Email'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

